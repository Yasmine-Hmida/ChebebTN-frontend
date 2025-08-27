import React, { useEffect } from "react";
import { router } from "expo-router"; /* For navigation */
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/Login");
    }, 1000); // Wait 1s to avoid system crashes

    return () => clearTimeout(timer); // Cleanup function
  }, []); // On first load

  return (
    <View style={style.container}>
      <Text style={style.title}>Welcome to ChebebTN</Text>
      <Text style={style.subtitle}>App Loading...</Text>
      <ActivityIndicator size="large" color="#800e13" style={style.loader} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1, // Takes up all the screen space
    backgroundColor: "#f6ededff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#640d14",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 10,
    textAlign: "center",
  },
  loader: {
    marginTop: 8
  },
});
