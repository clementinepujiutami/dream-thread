import { Tabs } from "expo-router";
import { Colors } from "@/src/theme/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { color: Colors.text },
        headerTintColor: Colors.text,
        sceneStyle: { backgroundColor: Colors.background },
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.mutedText,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Record",
          tabBarLabel: "Record",
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarLabel: "Journal",
        }}
      />
    </Tabs>
  );
}
