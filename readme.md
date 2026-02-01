# Tempestas 
### AI-powered sensor data analysis and prediction platform

An end-to-end, AI-driven system for collecting sensor data, processing it with machine learning models, and delivering insights through web and mobile applications.
The platform is designed for real-time monitoring, historical analysis, and predictive modeling based on environmental and sensor-based inputs.


# Overview

The project combines IoT data ingestion, AI/ML processing, and multi-platform access into a single scalable ecosystem.
Sensor data is stored centrally and processed by machine learning models exposed via an API.
Users can visualize current conditions, historical trends, and AI-generated predictions through web and mobile interfaces.

The system is modular, allowing each component (AI, backend, frontend, mobile) to scale independently.


# Core Features

- **AI / ML Prediction Engine** — Trains and serves machine learning models for forecasting and analysis.
- **Centralized Backend API** — Handles authentication, business logic, and orchestration.
- **Sensor Data Storage** — Stores raw and aggregated sensor data in PostgreSQL.
- **Time-Based Aggregation** — Supports minute, hourly, and long-term summaries.
- **Cross-Platform Access** — Web (Next.js) and mobile (Expo / React Native).
- **Shared Database** — Backend and AI services access the same PostgreSQL instance securely.

# System Architecture

## 1. Backend & AI Services

| Component        | Technology                    | Description                                                                 |
|------------------|-------------------------------|-----------------------------------------------------------------------------|
| **Backend API**  | C# / ASP.NET Core              | Authentication, domain logic, API gateway for frontend and mobile clients. |
| **AI Service**   | Python / FastAPI               | ML model training, inference, and data analysis endpoints.                  |
| **Database**     | PostgreSQL (Neon)              | Central data store for sensor data, users, and predictions.                |

---

## 2. Frontend Interfaces

| Platform        | Stack                          | Purpose                                                                  |
|-----------------|--------------------------------|--------------------------------------------------------------------------|
| **Web App**     | React / Next.js                | Data visualization, dashboards, and system management.                  |
| **Mobile App**  | Expo / React Native            | Mobile access to live data, alerts, and predictions.                    |

---

## 3. Data Model Overview

The PostgreSQL database contains the following core entities:

| Table                | Purpose                                                                 |
|----------------------|-------------------------------------------------------------------------|
| **Users**            | Stores user accounts and authentication data.                          |
| **Sensors**          | Metadata for registered sensors (type, location, calibration).         |
| **SensorReadings**   | Raw sensor values with timestamps.                                     |
| **Aggregates**       | Hourly/daily summarized sensor data.                                   |
| **Predictions**      | AI-generated predictions and confidence scores.                        |
| **Models**           | Metadata about ML models (version, type, training date).               |


# Hardware Architecture

The hardware layer is responsible for real-time environmental data acquisition and reliable transmission to the backend services. It is built around low-cost, widely supported IoT components to ensure scalability and ease of deployment.

## Core Components

| Component | Description |
|---------|-------------|
| **ESP32** | Primary microcontroller responsible for sensor polling, local preprocessing, and network communication. |
| **MQ-135** | Gas sensor used to measure air quality (VOC, CO₂-equivalent, NH₃, NOx). |
| **DHT11** | Digital sensor for ambient temperature and humidity readings. |

---

## System Design

- The **ESP32** acts as the edge device, reading sensor values at fixed intervals.
- **MQ-135** provides analog air quality measurements via the ESP32 ADC.
- **DHT11** provides calibrated digital temperature and humidity data over a single-wire protocol.
- Sensor readings are timestamped locally or server-side and serialized into JSON.
- Data is transmitted securely over **Wi-Fi** to the backend API.


# Getting Started

## Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- .NET SDK ≥ 8.0
- PostgreSQL ≥ 15
- npm / yarn
- Neon account (for database hosting)


## Installation & Start

### Clone the repository
```bash
git clone https://github.com/BolyarCoders/Tempestas.git
cd Tempestas
```