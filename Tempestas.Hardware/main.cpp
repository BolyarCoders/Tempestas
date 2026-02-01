#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"
#include <time.h>

#define MQ135_PIN 32

#define CLEAN_AIR 1100
#define DIRTY_AIR 3000

#define DHTPIN 4
#define DHTTYPE DHT11

const char* ssid = "*****";
const char* password = "******";
const char* apiUrl = "https://tempestas-16da.onrender.com/api/measurements";
const char* deviceId = "21c22fce-d945-48cc-a5cd-4a0b4897d160"; // constant

DHT dht(DHTPIN, DHTTYPE);

float temperature = 0;
float humidity = 0;
int dirtyAirPercent = 0;

SemaphoreHandle_t dataMutex;

int readDirtyPercent() {
  int raw = analogRead(MQ135_PIN);
  raw = constrain(raw, CLEAN_AIR, DIRTY_AIR);

  int percent = map(raw, CLEAN_AIR, DIRTY_AIR, 0, 100);
  return constrain(percent, 0, 100);
}

void taskMQ135(void *parameter) {
  while (true) {
    int dirty = readDirtyPercent();

    xSemaphoreTake(dataMutex, portMAX_DELAY);
    dirtyAirPercent = dirty;
    xSemaphoreGive(dataMutex);

    vTaskDelay(pdMS_TO_TICKS(1000));
  }
}

void taskDHT11(void *parameter) {
  while (true) {
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    if (!isnan(h) && !isnan(t)) {
        xSemaphoreTake(dataMutex, portMAX_DELAY);
        humidity = h;
        temperature = t;
        xSemaphoreGive(dataMutex);
    }

    vTaskDelay(pdMS_TO_TICKS(2000));
  }
}

void taskSendAPI(void *parameter) {
  vTaskDelay(pdMS_TO_TICKS(5000));
  
  while (true) {
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      
      xSemaphoreTake(dataMutex, portMAX_DELAY);
      float t = temperature;
      float h = humidity;
      int airQ = dirtyAirPercent;
      xSemaphoreGive(dataMutex);
      
      String timestamp = getTimestamp();
      String payload = "{";
      payload += "\"id\":\"11fbb7f2-ecfd-46cc-88ca-58b19d1b048d\",";
      payload += "\"device_id\":\"" + String(deviceId) + "\",";
      payload += "\"temperature\":" + String(t, 1) + ",";           // ← no quotes
      payload += "\"humidity\":" + String(h, 1) + ",";              // ← no quotes
      payload += "\"airQuality\":" + String(airQ) + ",";            // ← no quotes
      payload += "\"measuredAt\":\"" + timestamp + "\"";
      payload += "}";
      
      http.begin(apiUrl);
      http.setFollowRedirects(HTTPC_FORCE_FOLLOW_REDIRECTS); // ← Add this
      http.addHeader("Content-Type", "application/json");
      
      int httpCode = http.POST(payload);
      
      Serial.println("Sending payload:");
      Serial.println(payload);
      Serial.print("HTTP code: ");
      Serial.println(httpCode);
      
      if (httpCode == 307 || httpCode == 301 || httpCode == 302) {
        Serial.print("Redirected to: ");
        Serial.println(http.getLocation()); // Show where it's redirecting
      }
      
      http.end();
    }
    vTaskDelay(pdMS_TO_TICKS(30000));
  }
}

String getTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "";
  }

  char buffer[25];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}



void setup() {
  Serial.begin(115200);

  analogReadResolution(12);
  analogSetPinAttenuation(MQ135_PIN, ADC_11db);

  dht.begin();

  // Connect Wi-Fi first
  Serial.print("Connecting WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  // Configure NTP
  configTime(0, 0,
             "time.google.com",
             "time.cloudflare.com",
             "pool.ntp.org");

  struct tm timeinfo;
  int attempts = 0;
  while (!getLocalTime(&timeinfo) && attempts < 20) { // max 10s
    Serial.println("Waiting for time sync...");
    delay(500);
    attempts++;
  }
  if (attempts == 20) Serial.println("Time sync FAILED, continuing anyway");

  // Create mutex
  dataMutex = xSemaphoreCreateMutex();

  // Start FreeRTOS tasks
  xTaskCreatePinnedToCore(taskMQ135, "MQ135", 2048, NULL, 1, NULL, 1);
  xTaskCreatePinnedToCore(taskDHT11, "DHT11", 2048, NULL, 1, NULL, 1);
  xTaskCreatePinnedToCore(taskSendAPI, "API", 4096, NULL, 1, NULL, 0);
}

void loop() {
  // EMPTY — FreeRTOS owns execution
}

