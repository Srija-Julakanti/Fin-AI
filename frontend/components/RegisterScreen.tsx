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
	Alert,
	useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }: any) {
	const scheme = useColorScheme();
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(false);

	const handleRegister = async () => {
		// Validation
		if (
			!formData.fullName ||
			!formData.email ||
			!formData.phone ||
			!formData.password
		) {
			Alert.alert("Error", "Please fill in all required fields");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			Alert.alert("Error", "Passwords do not match!");
			return;
		}

		if (!agreedToTerms) {
			Alert.alert("Error", "Please agree to the Terms and Privacy Policy");
			return;
		}

		setIsLoading(true);
		setTimeout(async () => {
			await AsyncStorage.setItem("isAuthenticated", "true");
			await AsyncStorage.setItem("userProfile", JSON.stringify(formData));
			setIsLoading(false);
			// Navigation handled automatically by App.tsx
		}, 1500);
	};

	return (
		<LinearGradient
			colors={["#8b5cf6", "#3b82f6", "#0d9488"]}
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
						showsVerticalScrollIndicator={false}
					>
						{/* Header */}
						<View style={styles.header}>
							<TouchableOpacity
								style={styles.backButton}
								onPress={() => navigation.goBack()}
							>
								<Ionicons name="arrow-back" size={24} color="#fff" />
							</TouchableOpacity>
						</View>

						{/* Logo & Title */}
						<View style={styles.logoContainer}>
							<View style={styles.logo}>
								<Ionicons name="sparkles" size={40} color="#8b5cf6" />
							</View>
							<Text style={styles.title}>Create Account</Text>
							<Text style={styles.subtitle}>
								Join Fin-AI and take control of your finances
							</Text>
						</View>

						{/* Registration Form */}
						<View style={styles.card}>
							{/* Personal Information Section */}
							<Text style={styles.sectionTitle}>Personal Information</Text>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Full Name *</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="person"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="John Doe"
										placeholderTextColor="#94a3b8"
										value={formData.fullName}
										onChangeText={(text) =>
											setFormData({ ...formData, fullName: text })
										}
									/>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Email Address *</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="mail"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="john.doe@example.com"
										placeholderTextColor="#94a3b8"
										value={formData.email}
										onChangeText={(text) =>
											setFormData({ ...formData, email: text })
										}
										keyboardType="email-address"
										autoCapitalize="none"
									/>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Phone Number *</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="call"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="+1 (555) 123-4567"
										placeholderTextColor="#94a3b8"
										value={formData.phone}
										onChangeText={(text) =>
											setFormData({ ...formData, phone: text })
										}
										keyboardType="phone-pad"
									/>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Date of Birth</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="calendar"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="MM/DD/YYYY"
										placeholderTextColor="#94a3b8"
										value={formData.dateOfBirth}
										onChangeText={(text) =>
											setFormData({ ...formData, dateOfBirth: text })
										}
									/>
								</View>
							</View>

							{/* Address Section */}
							<Text style={[styles.sectionTitle, { marginTop: 24 }]}>
								Address
							</Text>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Street Address</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="home"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="123 Main Street"
										placeholderTextColor="#94a3b8"
										value={formData.address}
										onChangeText={(text) =>
											setFormData({ ...formData, address: text })
										}
									/>
								</View>
							</View>

							<View style={styles.row}>
								<View
									style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
								>
									<Text style={styles.label}>City</Text>
									<View style={styles.inputWrapper}>
										<TextInput
											style={styles.input}
											placeholder="New York"
											placeholderTextColor="#94a3b8"
											value={formData.city}
											onChangeText={(text) =>
												setFormData({ ...formData, city: text })
											}
										/>
									</View>
								</View>

								<View
									style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}
								>
									<Text style={styles.label}>State</Text>
									<View style={styles.inputWrapper}>
										<TextInput
											style={styles.input}
											placeholder="NY"
											placeholderTextColor="#94a3b8"
											value={formData.state}
											onChangeText={(text) =>
												setFormData({ ...formData, state: text })
											}
											autoCapitalize="characters"
											maxLength={2}
										/>
									</View>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>ZIP Code</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="location"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="10001"
										placeholderTextColor="#94a3b8"
										value={formData.zipCode}
										onChangeText={(text) =>
											setFormData({ ...formData, zipCode: text })
										}
										keyboardType="number-pad"
										maxLength={5}
									/>
								</View>
							</View>

							{/* Security Section */}
							<Text style={[styles.sectionTitle, { marginTop: 24 }]}>
								Security
							</Text>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Password *</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="lock-closed"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="Create a strong password"
										placeholderTextColor="#94a3b8"
										value={formData.password}
										onChangeText={(text) =>
											setFormData({ ...formData, password: text })
										}
										secureTextEntry={!showPassword}
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
								<Text style={styles.hint}>
									At least 8 characters with numbers and symbols
								</Text>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Confirm Password *</Text>
								<View style={styles.inputWrapper}>
									<Ionicons
										name="lock-closed"
										size={20}
										color="#64748b"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="Re-enter your password"
										placeholderTextColor="#94a3b8"
										value={formData.confirmPassword}
										onChangeText={(text) =>
											setFormData({ ...formData, confirmPassword: text })
										}
										secureTextEntry={!showConfirmPassword}
									/>
									<TouchableOpacity
										style={styles.eyeButton}
										onPress={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										<Ionicons
											name={showConfirmPassword ? "eye-off" : "eye"}
											size={20}
											color="#64748b"
										/>
									</TouchableOpacity>
								</View>
							</View>

							{/* Terms and Conditions */}
							<TouchableOpacity
								style={styles.checkboxContainer}
								onPress={() => setAgreedToTerms(!agreedToTerms)}
							>
								<View
									style={[
										styles.checkbox,
										agreedToTerms && styles.checkboxChecked,
									]}
								>
									{agreedToTerms && (
										<Ionicons name="checkmark" size={16} color="#fff" />
									)}
								</View>
								<Text style={styles.checkboxLabel}>
									I agree to the{" "}
									<Text style={styles.link}>Terms of Service</Text> and{" "}
									<Text style={styles.link}>Privacy Policy</Text>
								</Text>
							</TouchableOpacity>

							{/* Register Button */}
							<TouchableOpacity
								onPress={handleRegister}
								disabled={isLoading}
								activeOpacity={0.8}
							>
								<LinearGradient
									colors={["#8b5cf6", "#6d28d9"]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									style={styles.registerButton}
								>
									<Text style={styles.registerText}>
										{isLoading ? "Creating Account..." : "Create Account"}
									</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>

						{/* Login Link */}
						<View style={styles.loginContainer}>
							<Text style={styles.loginText}>Already have an account?</Text>
							<TouchableOpacity onPress={() => navigation.navigate("Login")}>
								<Text style={styles.loginLink}>Sign In</Text>
							</TouchableOpacity>
						</View>

						<View style={{ height: 40 }} />
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
		padding: 24,
	},
	header: {
		marginBottom: 20,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 32,
	},
	logo: {
		width: 80,
		height: 80,
		borderRadius: 24,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
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
		textAlign: "center",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 24,
		padding: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#1e293b",
		marginBottom: 16,
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
	hint: {
		fontSize: 12,
		color: "#64748b",
		marginTop: 4,
	},
	row: {
		flexDirection: "row",
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: "#e2e8f0",
		marginRight: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxChecked: {
		backgroundColor: "#8b5cf6",
		borderColor: "#8b5cf6",
	},
	checkboxLabel: {
		flex: 1,
		fontSize: 14,
		color: "#64748b",
	},
	link: {
		color: "#8b5cf6",
		fontWeight: "600",
	},
	registerButton: {
		height: 56,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	registerText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#fff",
	},
	loginContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
	},
	loginText: {
		color: "#fff",
		fontSize: 14,
	},
	loginLink: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
		marginLeft: 4,
		textDecorationLine: "underline",
	},
});
