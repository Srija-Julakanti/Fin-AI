import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
	const scheme = useColorScheme();
	const isDark = scheme === "dark";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		setIsLoading(true);
		setTimeout(async () => {
			await AsyncStorage.setItem("isAuthenticated", "true");
			setIsLoading(false);
			// Navigation handled automatically by App.tsx
		}, 1000);
	};

	return (
		<LinearGradient
			colors={["#0d9488", "#3b82f6", "#8b5cf6"]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.gradient}
		>
			<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={{ flex: 1 }}
				>
					<ScrollView
						contentContainerStyle={styles.content}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					>
						{/* Logo & Title */}
						<View style={styles.logoContainer}>
							<View style={styles.logo}>
								<Ionicons name="sparkles" size={40} color="#0d9488" />
							</View>
							<Text style={styles.title}>Welcome to Fin-AI</Text>
							<Text style={styles.subtitle}>
								Your AI Personal Finance Assistant
							</Text>
						</View>

						{/* Login Form */}
						<View style={styles.card}>
							<View style={styles.inputContainer}>
								<Text style={styles.label}>Email Address</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="mail"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="your.email@example.com"
										placeholderTextColor="#94a3b8"
										value={email}
										onChangeText={setEmail}
										keyboardType="email-address"
										autoCapitalize="none"
										autoCorrect={false}
									/>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Password</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="lock-closed"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="Enter your password"
										placeholderTextColor="#94a3b8"
										value={password}
										onChangeText={setPassword}
										secureTextEntry={!showPassword}
										autoCapitalize="none"
									/>
									<TouchableOpacity
										style={styles.eyeButton}
										onPress={() => setShowPassword(!showPassword)}
									>
										<Ionicons
											name={showPassword ? "eye-off" : "eye"}
											size={20}
											color="#64748b"
										/>
									</TouchableOpacity>
								</View>
							</View>

							<TouchableOpacity style={styles.forgotPassword}>
								<Text style={styles.forgotText}>Forgot password?</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={handleLogin}
								disabled={isLoading}
								activeOpacity={0.8}
							>
								<LinearGradient
									colors={["#0d9488", "#0f766e"]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									style={styles.loginButton}
								>
									<Text style={styles.loginText}>
										{isLoading ? "Signing in..." : "Sign In"}
									</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>

						{/* Register Link */}
						<View style={styles.registerContainer}>
							<Text style={styles.registerText}>
								Don&#39;t have an account?
							</Text>
							<TouchableOpacity onPress={() => navigation.navigate("Register")}>
								<Text style={styles.registerLink}>Create Account</Text>
							</TouchableOpacity>
						</View>

						{/* Features */}
						<View style={styles.features}>
							<View style={styles.featureItem}>
								<Ionicons name="shield-checkmark" size={20} color="#fff" />
								<Text style={styles.featureText}>Bank-level encryption</Text>
							</View>
							<View style={styles.featureItem}>
								<Ionicons name="sparkles" size={20} color="#fff" />
								<Text style={styles.featureText}>AI-powered insights</Text>
							</View>
							<View style={styles.featureItem}>
								<Ionicons name="wallet" size={20} color="#fff" />
								<Text style={styles.featureText}>Smart budget tracking</Text>
							</View>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	gradient: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 24,
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 40,
	},
	logo: {
		width: 80,
		height: 80,
		borderRadius: 24,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "rgba(255, 255, 255, 0.8)",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 24,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: 8,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f1f5f9",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		paddingHorizontal: 16,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		height: 48,
		fontSize: 16,
		color: "#1e293b",
	},
	eyeButton: {
		padding: 4,
	},
	forgotPassword: {
		alignSelf: "flex-end",
		marginBottom: 24,
	},
	forgotText: {
		color: "#0d9488",
		fontSize: 14,
		fontWeight: "600",
	},
	loginButton: {
		height: 56,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	loginText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#fff",
	},
	registerContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
	},
	registerText: {
		color: "#fff",
		fontSize: 14,
	},
	registerLink: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
		marginLeft: 4,
		textDecorationLine: "underline",
	},
	features: {
		marginTop: 32,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 16,
		padding: 20,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.2)",
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	featureText: {
		color: "#fff",
		fontSize: 14,
		marginLeft: 12,
		opacity: 0.9,
	},
});
