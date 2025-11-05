import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
	return (
		<AuthProvider>
			<Stack screenOptions={{ headerShown: false }}>
				{/* 👇 Make the tabs group a known route */}
				<Stack.Screen name="(tabs)" />

				{/* Auth screens */}
				<Stack.Screen name="login" />
				<Stack.Screen name="register" />
			</Stack>
		</AuthProvider>
	);
}
