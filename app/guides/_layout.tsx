import { Stack } from 'expo-router';

export default function GuidesLayout() {
  return (
    <Stack>
      <Stack.Screen name="payment" options={{ headerShown: false }} />
      <Stack.Screen name="troubleshooting" options={{ headerShown: false }} />
      <Stack.Screen name="upgrade" options={{ headerShown: false }} />
    </Stack>
  );
}