import { useState } from "react";
import {
	Alert,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
	const { register } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleRegister = async () => {
		try {
			await register(email, password);
		} catch (err: any) {
			Alert.alert("Error", err.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create Account</Text>
			<TextInput
				style={styles.input}
				placeholder="Email"
				autoCapitalize="none"
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<Pressable style={styles.btn} onPress={handleRegister}>
				<Text style={styles.btnText}>Register</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", padding: 20 },
	title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		borderRadius: 8,
		marginBottom: 12,
	},
	btn: {
		backgroundColor: "#111827",
		padding: 14,
		borderRadius: 10,
		alignItems: "center",
	},
	btnText: { color: "#fff", fontWeight: "bold" },
});
