import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/src/theme/colors";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
    </>
  );
}
