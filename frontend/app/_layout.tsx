import { Redirect, Stack } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootLayoutInner() {
	const { user } = useAuth();

	if (user) {
		// When logged in → go to home tabs
		return <Redirect href="/(tabs)" />;
	}

	return (
		<Stack>
			<Stack.Screen name="login" options={{ title: "Login" }} />
			<Stack.Screen name="register" options={{ title: "Register" }} />
		</Stack>
	);
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<RootLayoutInner />
		</AuthProvider>
	);
}
