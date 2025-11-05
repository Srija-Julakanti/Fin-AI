import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
	Home,
	Wallet,
	CreditCard,
	TrendingUp,
	Settings,
} from "lucide-react-native";

interface BottomNavProps {
	currentScreen: string;
	onNavigate: (screen: string) => void;
}

export default function BottomNav({
	currentScreen,
	onNavigate,
}: BottomNavProps) {
	const navItems = [
		{ id: "home", icon: Home, label: "Home" },
		{ id: "budget", icon: Wallet, label: "Budget" },
		{ id: "cards", icon: CreditCard, label: "Cards" },
		{ id: "forecast", icon: TrendingUp, label: "Forecast" },
		{ id: "settings", icon: Settings, label: "Settings" },
	];

	return (
		<View style={styles.container}>
			{navItems.map((item) => {
				const isActive = currentScreen === item.id;
				const Icon = item.icon;
				return (
					<TouchableOpacity
						key={item.id}
						onPress={() => onNavigate(item.id)}
						style={styles.navButton}
					>
						<Icon color={isActive ? "#14b8a6" : "#94a3b8"} size={24} />
						<Text
							style={[
								styles.label,
								{ color: isActive ? "#14b8a6" : "#94a3b8" },
							]}
						>
							{item.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#ffffff",
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingVertical: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 5,
	},
	navButton: {
		alignItems: "center",
	},
	label: {
		fontSize: 12,
		marginTop: 2,
	},
});
