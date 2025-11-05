import { Redirect, Tabs } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
	const { user } = useAuth();

	if (!user) {
		return <Redirect href="/login" />;
	}

	return (
		<Tabs>
			<Tabs.Screen name="index" options={{ title: "Home" }} />
			<Tabs.Screen name="forecast" options={{ title: "Forecast" }} />
			<Tabs.Screen name="budget" options={{ title: "Budget" }} />
			<Tabs.Screen name="settings" options={{ title: "Settings" }} />
		</Tabs>
	);
}
