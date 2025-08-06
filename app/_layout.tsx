import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return ( 
      <>
        <StatusBar style="auto"/>

        {/* Stack : The navigation system for your app */}
        <Stack
          screenOptions={{
            animation: "slide_from_right", // makes screens slide in from the right 
            headerShown: false 
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/Login" />
          <Stack.Screen name="(auth)/Register" />
          <Stack.Screen name="(screens)/Home" />
          <Stack.Screen name="(screens)/Add" />
        </Stack>
      </>
  );
}