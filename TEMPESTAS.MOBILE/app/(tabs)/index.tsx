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
                source={require("../../assets/icons/logo.png")}
                style={indexStyles.logo}
                resizeMode="contain"
              />
              <View style={indexStyles.decorativeCircle} />
            </View>
            <Text style={indexStyles.brandName}>ПромоМания</Text>
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
            <Text style={indexStyles.welcomeText}>
              Откривай. Сравнявай. Пести.
            </Text>
            <Text style={indexStyles.subText}>
              Всички намаления на едно място.{"\n"}
              Сравнявай цени. Спести повече.
            </Text>

            <Animated.View
              style={[
                indexStyles.featuresContainer,
                { opacity: featuresFadeAnim },
              ]}
            >
              <FeatureItem text="Оферти от всички големи магазини" />
              <FeatureItem text="Мигновено сравнение на цени" />
              <FeatureItem text="Проследяване на най-ниските цени" />
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
              onPress={() => router.push("/")}
              activeOpacity={0.8}
              style={indexStyles.button}
            >
              <LinearGradient
                colors={["rgba(46, 170, 134, 1)", "rgba(40, 150, 120, 1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={indexStyles.buttonGradient}
              >
                <Text style={indexStyles.buttonText}>Започни сега</Text>
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
