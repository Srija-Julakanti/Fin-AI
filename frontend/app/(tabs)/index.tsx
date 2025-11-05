{/* import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { View, useColorScheme } from "react-native";

// Import screens
import LoginScreen from "../../components/LoginScreen";
import RegisterScreen from "../../components/RegisterScreen";
import OnboardingScreen from "../../components/OnboardingScreens";
import HomeScreen from "../../components/HomeDashboard";
import ForecastScreen from "./screens/ForecastScreen";
import CardsScreen from "./screens/CardsScreen";
import BudgetScreen from "./screens/BudgetScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AddCardScreen from "./screens/AddCardScreen";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import CreateBudgetScreen from "./screens/CreateBudgetScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SecuritySettingsScreen from "./screens/SecuritySettingsScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import HelpCenterScreen from "./screens/HelpCenterScreen";
import ContactSupportScreen from "./screens/ContactSupportScreen";
import FamilyFinanceScreen from "./screens/FamilyFinanceScreen";
import SubscriptionsScreen from "./screens/SubscriptionsScreen";
import FraudAlertsScreen from "./screens/FraudAlertsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Theme colors
const lightColors = {
	primary: "#0d9488",
	background: "#f8fafc",
	card: "#ffffff",
	text: "#1e293b",
	textSecondary: "#64748b",
	border: "#e2e8f0",
};

const darkColors = {
	primary: "#14b8a6",
	background: "#0f172a",
	card: "#1e293b",
	text: "#f1f5f9",
	textSecondary: "#94a3b8",
	border: "#334155",
};

function MainTabs() {
	const scheme = useColorScheme();
	const colors = scheme === "dark" ? darkColors : lightColors;

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarIcon: ({ focused, color, size }) => {
					let iconName: any;

					if (route.name === "Home") {
						iconName = focused ? "home" : "home-outline";
					} else if (route.name === "Forecast") {
						iconName = focused ? "trending-up" : "trending-up-outline";
					} else if (route.name === "Cards") {
						iconName = focused ? "card" : "card-outline";
					} else if (route.name === "Budget") {
						iconName = focused ? "wallet" : "wallet-outline";
					} else if (route.name === "Settings") {
						iconName = focused ? "settings" : "settings-outline";
					}

					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.textSecondary,
				tabBarStyle: {
					backgroundColor: colors.card,
					borderTopColor: colors.border,
					paddingBottom: 8,
					paddingTop: 8,
					height: 60,
				},
				tabBarLabelStyle: {
					fontSize: 12,
				},
			})}
		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Forecast" component={ForecastScreen} />
			<Tab.Screen name="Cards" component={CardsScreen} />
			<Tab.Screen name="Budget" component={BudgetScreen} />
			<Tab.Screen name="Settings" component={SettingsScreen} />
		</Tab.Navigator>
	);
}

function AppNavigator() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [onboardingComplete, setOnboardingComplete] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const scheme = useColorScheme();
	const colors = scheme === "dark" ? darkColors : lightColors;

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const auth = await AsyncStorage.getItem("isAuthenticated");
			const onboarding = await AsyncStorage.getItem("onboardingComplete");
			setIsAuthenticated(auth === "true");
			setOnboardingComplete(onboarding === "true");
		} catch (error) {
			console.error("Error checking auth status:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <View style={{ flex: 1, backgroundColor: colors.background }} />;
	}

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: colors.background },
				headerTintColor: colors.text,
				headerShadowVisible: false,
			}}
		>
			{!isAuthenticated ? (
				<>
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Register"
						component={RegisterScreen}
						options={{ headerShown: false }}
					/>
				</>
			) : !onboardingComplete ? (
				<Stack.Screen
					name="Onboarding"
					component={OnboardingScreen}
					options={{ headerShown: false }}
				/>
			) : (
				<>
					<Stack.Screen
						name="MainTabs"
						component={MainTabs}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddCard"
						component={AddCardScreen}
						options={{ title: "Add Credit Card" }}
					/>
					<Stack.Screen
						name="AddExpense"
						component={AddExpenseScreen}
						options={{ title: "Add Expense" }}
					/>
					<Stack.Screen
						name="CreateBudget"
						component={CreateBudgetScreen}
						options={{ title: "Create Budget" }}
					/>
					<Stack.Screen
						name="Profile"
						component={ProfileScreen}
						options={{ title: "Profile" }}
					/>
					<Stack.Screen
						name="SecuritySettings"
						component={SecuritySettingsScreen}
						options={{ title: "Security" }}
					/>
					<Stack.Screen
						name="PrivacyPolicy"
						component={PrivacyPolicyScreen}
						options={{ title: "Privacy Policy" }}
					/>
					<Stack.Screen
						name="HelpCenter"
						component={HelpCenterScreen}
						options={{ title: "Help Center" }}
					/>
					<Stack.Screen
						name="ContactSupport"
						component={ContactSupportScreen}
						options={{ title: "Contact Support" }}
					/>
					<Stack.Screen
						name="FamilyFinance"
						component={FamilyFinanceScreen}
						options={{ title: "Family Finance" }}
					/>
					<Stack.Screen
						name="Subscriptions"
						component={SubscriptionsScreen}
						options={{ title: "Subscriptions" }}
					/>
					<Stack.Screen
						name="FraudAlerts"
						component={FraudAlertsScreen}
						options={{ title: "Fraud Alerts" }}
					/>
				</>
			)}
		</Stack.Navigator>
	);
}

export default function App() {
	return (
		<NavigationContainer>
			<AppNavigator />
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}

*/}

