import { FeatureItem } from "@/components/FeatureItem";
import { indexStyles } from "@/components/welcomeStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Index = () => {
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(0.95)).current;
  const featuresFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(featuresFadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={indexStyles.backgroundImage}>
      <ScrollView
        contentContainerStyle={indexStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={indexStyles.content}>
          {/* Logo */}
          <Animated.View
            style={[
              indexStyles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={indexStyles.logoWrapper}>
              <Image
                source={require("@/assets/icons/logo.png")}
                style={indexStyles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={indexStyles.brandName}>Tempestas</Text>
          </Animated.View>

          {/* Welcome text */}
          <Animated.View
            style={[
              indexStyles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={indexStyles.subWelocomeText}>
              Monitor. Predict. Stay Safe.
            </Text>
            <Text style={indexStyles.subText}>
              Tempestas shows you real-time air quality, temperature, and
              humidity.{"\n"}
              Get alerts and advice to protect yourself from pollution.
            </Text>

            <Animated.View
              style={[
                indexStyles.featuresContainer,
                { opacity: featuresFadeAnim },
              ]}
            >
              <FeatureItem text="Real-time air quality, temperature, and humidity" />
              <FeatureItem text="Predictions for the next hours" />
              <FeatureItem text="Notifications when to close your windows" />
            </Animated.View>
          </Animated.View>

          {/* Button */}
          <Animated.View
            style={[
              indexStyles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: buttonScale }],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.push("/onboarding")}
              activeOpacity={0.8}
              style={indexStyles.button}
            >
              <LinearGradient
                colors={["#22D3EE", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={indexStyles.buttonGradient}
              >
                <Text style={indexStyles.buttonText}>Continiue</Text>
                <Text style={indexStyles.buttonText}>-&gt;</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
