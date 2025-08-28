import React, { useEffect } from "react";
import { router } from "expo-router"; /* For navigation */
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
const { height, width } = Dimensions.get("window"); // For a responsive styling based on the window dimensions

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/Login");
    }, 1000); // Wait 1s to avoid system crashes

    return () => clearTimeout(timer); // Cleanup function
  }, []); // On first load

  return (
    <View style={style.container}>
      <Text style={style.title}>ChebebTN</Text>
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
    fontFamily: "DosisExtraBold",
    fontSize: width * 0.08,
    color: "#640d14",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  loader: {
    marginTop: 8,
  },
});
