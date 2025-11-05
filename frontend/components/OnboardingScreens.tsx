import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	useColorScheme,
	Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function OnboardingScreen({ onComplete }: any) {
	const scheme = useColorScheme();
	const [currentStep, setCurrentStep] = useState(0);

	const slides = [
		{
			icon: "wallet" as const,
			title: "Smart Budget Tracking",
			description:
				"Track your expenses and manage your budget with AI-powered insights",
			color: "#0d9488",
		},
		{
			icon: "trending-up" as const,
			title: "Financial Forecasting",
			description:
				"Predict your future spending and plan ahead with confidence",
			color: "#3b82f6",
		},
		{
			icon: "people" as const,
			title: "Family Finance",
			description:
				"Manage household expenses together and track family budgets",
			color: "#8b5cf6",
		},
		{
			icon: "shield-checkmark" as const,
			title: "Secure & Private",
			description: "Bank-level encryption keeps your financial data safe",
			color: "#10b981",
		},
	];

	const handleNext = async () => {
		if (currentStep < slides.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			await AsyncStorage.setItem("onboardingComplete", "true");
		}
	};

	const handleSkip = async () => {
		await AsyncStorage.setItem("onboardingComplete", "true");
	};

	const slide = slides[currentStep];

	return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<View style={styles.content}>
				{currentStep < slides.length - 1 && (
					<TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
						<Text style={styles.skipText}>Skip</Text>
					</TouchableOpacity>
				)}

				<View style={styles.slideContent}>
					<LinearGradient
						colors={[slide.color + "30", slide.color + "10"]}
						style={styles.iconContainer}
					>
						<Ionicons name={slide.icon} size={60} color={slide.color} />
					</LinearGradient>
					<Text style={styles.title}>{slide.title}</Text>
					<Text style={styles.description}>{slide.description}</Text>
				</View>

				<View style={styles.footer}>
					<View style={styles.pagination}>
						{slides.map((_, index) => (
							<View
								key={index}
								style={[styles.dot, index === currentStep && styles.dotActive]}
							/>
						))}
					</View>

					<TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
						<LinearGradient
							colors={["#0d9488", "#0f766e"]}
							style={styles.nextButton}
						>
							<Text style={styles.nextText}>
								{currentStep < slides.length - 1 ? "Next" : "Get Started"}
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	content: {
		flex: 1,
		padding: 24,
		justifyContent: "space-between",
	},
	skipButton: {
		alignSelf: "flex-end",
		padding: 12,
	},
	skipText: {
		color: "#64748b",
		fontSize: 16,
		fontWeight: "600",
	},
	slideContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	iconContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 40,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#1e293b",
		textAlign: "center",
		marginBottom: 16,
	},
	description: {
		fontSize: 16,
		color: "#64748b",
		textAlign: "center",
		paddingHorizontal: 20,
		lineHeight: 24,
	},
	footer: {
		paddingBottom: 20,
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 32,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#e2e8f0",
		marginHorizontal: 4,
	},
	dotActive: {
		backgroundColor: "#0d9488",
		width: 24,
	},
	nextButton: {
		height: 56,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	nextText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#fff",
	},
});
