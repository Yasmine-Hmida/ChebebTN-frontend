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
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/Register" options={{ headerShown: false }} />
        </Stack>
      </>
  );
}