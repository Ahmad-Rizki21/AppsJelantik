import { Stack } from 'expo-router';

export default function ToolsLayout() {
  return (
    <Stack>
      <Stack.Screen name="router" options={{ headerShown: false }} />
    </Stack>
  );
}
