import { Stack } from 'expo-router';

export default function DocsLayout() {
  return (
    <Stack>
      <Stack.Screen name="user-guide" options={{ headerShown: false }} />
    </Stack>
  );
}