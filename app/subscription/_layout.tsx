import { Stack } from 'expo-router';

export default function SubscriptionLayout() {
  return (
    <Stack>
      <Stack.Screen name="package-detail" options={{ headerShown: false }} />
    </Stack>
  );
}
