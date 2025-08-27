import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "DosisRegular": require("../assets/fonts/Dosis-Regular.ttf"),
        "DosisMedium": require("../assets/fonts/Dosis-Medium.ttf"),
        "DosisBold": require("../assets/fonts/Dosis-Bold.ttf"),
        "DosisExtraBold": require("../assets/fonts/Dosis-ExtraBold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <>
      <StatusBar style="auto" />

      {/* Stack : The navigation system for your app */}
      <Stack
        screenOptions={{
          animation: "slide_from_right", // makes screens slide in from the right 
          headerShown: false,
        }}
      >
        {/* Define our screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/Login" />
        <Stack.Screen name="(auth)/Register" />
        <Stack.Screen name="(screens)/Home" />
        <Stack.Screen name="(screens)/Add" />
        <Stack.Screen name="(screens)/(Edit)/[id]" />
        <Stack.Screen name="(screens)/(JobDetails)/[id]" />
      </Stack>
    </>
  );
}
