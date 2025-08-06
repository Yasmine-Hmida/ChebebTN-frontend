import React, { useEffect } from "react";
import { router } from "expo-router"; /* For navigation */
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(screens)/Home");
    }, 1000); // Wait 1s to avoid system crashes

    return () => clearTimeout(timer); // Cleanup function
  }, []); // On first load

  return (
    <View style={style.container}>
      <Text style={style.title}>Welcome</Text>
      <Text style={style.subtitle}>Loading...</Text>
      <ActivityIndicator size="large" color="#007AFF" style={style.loader} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F41BB",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  loader: {
    marginTop: 8
  },
});
