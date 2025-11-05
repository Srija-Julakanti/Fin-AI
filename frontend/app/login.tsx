import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	View,
} from "react-native";
import FinAICard from "../components/FinAICard";
import { useAuth } from "../contexts/AuthContext";

// Optional: persist token securely
// import * as SecureStore from "expo-secure-store";

const API_BASE = "http://localhost:8000"; // iOS simulator

export default function Login() {
	const { login } = useAuth(); // this sets your in-memory auth state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async () => {
		if (!email || !password) {
			Alert.alert("Missing fields", "Please enter email and password.");
			return;
		}

		setIsLoading(true);
		try {
			const res = await fetch(`${API_BASE}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data: any = await res.json().catch(() => ({}));

			if (res.status !== 200) {
				const msg =
					data?.message ||
					data?.error ||
					(Array.isArray(data?.errors) ? data.errors.join("\n") : null) ||
					"Invalid credentials. Please try again.";
				throw new Error(msg);
			}

			// ✅ Extract user and token (if any)
			const user = data?.user;
			const token = data?.token || null;

			if (!user) throw new Error("Login response missing user info.");

			// ✅ Store in context
			login(user, token);

			// Navigation happens automatically since _layout checks `user`
			router.replace("/(tabs)");
		} catch (err: any) {
			Alert.alert("Sign in failed", err?.message ?? "Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<LinearGradient
			colors={["#14b8a6", "#3b82f6", "#7c3aed"]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.gradient}
		>
			<View style={styles.wrap}>
				{/* Logo & Heading */}
				<View style={styles.header}>
					<View style={styles.logoBox}>
						{/* <Image source={require("../assets/images/logo.png")} style={styles.logoImg} /> */}
						<Feather name="star" size={40} color="#0f766e" />
					</View>
					<Text style={styles.title}>Welcome to Fin-AI</Text>
					<Text style={styles.subtitle}>
						Your AI Personal Finance Assistant
					</Text>
				</View>

				{/* Login form */}
				<FinAICard>
					{/* Email */}
					<View style={styles.fieldWrap}>
						<Text style={styles.label}>Email Address</Text>
						<View style={styles.inputRow}>
							<Feather
								name="mail"
								size={20}
								color="#9ca3af"
								style={styles.leftIcon}
							/>
							<TextInput
								placeholder="your.email@example.com"
								placeholderTextColor="#9ca3af"
								autoCapitalize="none"
								keyboardType="email-address"
								value={email}
								onChangeText={setEmail}
								style={[styles.input, { paddingLeft: 40 }]}
							/>
						</View>
					</View>

					{/* Password */}
					<View style={styles.fieldWrap}>
						<Text style={styles.label}>Password</Text>
						<View style={styles.inputRow}>
							<Feather
								name="lock"
								size={20}
								color="#9ca3af"
								style={styles.leftIcon}
							/>
							<TextInput
								placeholder="Enter your password"
								placeholderTextColor="#9ca3af"
								secureTextEntry={!showPassword}
								value={password}
								onChangeText={setPassword}
								style={[styles.input, { paddingLeft: 40, paddingRight: 40 }]}
							/>
							<Pressable
								accessibilityLabel={
									showPassword ? "Hide password" : "Show password"
								}
								onPress={() => setShowPassword((s) => !s)}
								style={styles.rightIconBtn}
							>
								<Feather
									name={showPassword ? "eye-off" : "eye"}
									size={20}
									color="#6b7280"
								/>
							</Pressable>
						</View>
					</View>

					{/* Helpers */}
					<View style={styles.helpersRow}>
						<View style={styles.rememberRow}>
							<Switch value={remember} onValueChange={setRemember} />
							<Text style={styles.rememberText}>Remember me</Text>
						</View>

						<Pressable
							onPress={() =>
								Alert.alert("Forgot password", "Hook up your flow here.")
							}
						>
							<Text style={styles.forgot}>Forgot password?</Text>
						</Pressable>
					</View>

					{/* Submit */}
					<Pressable
						onPress={handleSubmit}
						disabled={isLoading}
						style={({ pressed }) => [
							styles.submitBtn,
							pressed && { opacity: 0.85 },
							isLoading && { opacity: 0.7 },
						]}
					>
						{isLoading ? (
							<ActivityIndicator />
						) : (
							<Text style={styles.submitText}>Sign In</Text>
						)}
					</Pressable>
				</FinAICard>

				{/* Register */}
				<View style={styles.registerWrap}>
					<Text style={styles.registerText}>
						Don&apos;t have an account?{" "}
						<Link href="/register" style={styles.registerLink}>
							Create Account
						</Link>
					</Text>
				</View>

				{/* Features card */}
				<FinAICard variant="glass">
					<View style={styles.features}>
						<Text style={styles.featureLine}>✓ Bank-level encryption</Text>
						<Text style={styles.featureLine}>✓ AI-powered insights</Text>
						<Text style={styles.featureLine}>✓ Smart budget tracking</Text>
						<Text style={styles.featureLine}>✓ Family finance management</Text>
					</View>
				</FinAICard>
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	gradient: { flex: 1 },
	wrap: { flex: 1, padding: 24, justifyContent: "center" },

	header: { alignItems: "center", marginBottom: 18 },
	logoBox: {
		width: 80,
		height: 80,
		borderRadius: 24,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	logoImg: { width: 44, height: 44, resizeMode: "contain" },
	title: { color: "white", fontSize: 26, fontWeight: "700" },
	subtitle: { color: "rgba(255,255,255,0.85)", marginTop: 6 },

	fieldWrap: { marginBottom: 14 },
	label: { color: "#0f172a", fontWeight: "600", marginBottom: 6, opacity: 0.9 },
	inputRow: { position: "relative" },
	input: {
		height: 48,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 12,
		backgroundColor: "white",
		paddingHorizontal: 12,
		fontSize: 16,
	},
	leftIcon: { position: "absolute", left: 12, top: 14 },
	rightIconBtn: { position: "absolute", right: 12, top: 14, padding: 4 },

	helpersRow: {
		marginTop: 4,
		marginBottom: 14,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	rememberRow: { flexDirection: "row", alignItems: "center", gap: 8 },
	rememberText: { color: "#475569", marginLeft: 8 },
	forgot: { color: "#0ea5e9", fontWeight: "600" },

	submitBtn: {
		height: 52,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#2563eb",
	},
	submitText: { color: "white", fontWeight: "700", fontSize: 16 },

	registerWrap: { alignItems: "center", marginTop: 14 },
	registerText: { color: "rgba(255,255,255,0.95)" },
	registerLink: { color: "white", textDecorationLine: "underline" },

	features: { gap: 4 },
	featureLine: { color: "white", opacity: 0.95 },
});
