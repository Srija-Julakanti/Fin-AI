import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	Alert,
} from "react-native";
import {
	CreditCard,
	ArrowLeft,
	Check,
	User,
	Users,
	Phone,
} from "lucide-react-native";

interface AddCardScreenProps {
	onBack?: () => void;
	onSuccess?: () => void;
	onClose?: () => void;
}

const cardBinDatabase: Record<string, { name: string; type: string }> = {
	"4": { name: "Visa", type: "visa" },
	"51": { name: "Mastercard", type: "mastercard" },
	"52": { name: "Mastercard", type: "mastercard" },
	"53": { name: "Mastercard", type: "mastercard" },
	"54": { name: "Mastercard", type: "mastercard" },
	"55": { name: "Mastercard", type: "mastercard" },
	"34": { name: "Amex", type: "amex" },
	"37": { name: "Amex", type: "amex" },
	"6011": { name: "Discover", type: "discover" },
	"65": { name: "Discover", type: "discover" },
};

export default function AddCardScreen({
	onBack,
	onSuccess,
	onClose,
}: AddCardScreenProps) {
	const [formData, setFormData] = useState({
		cardName: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardType: "",
		cardHolder: "self",
		holderName: "",
		phoneNumber: "",
	});
	const [detectedCardInfo, setDetectedCardInfo] = useState<{
		name: string;
		type: string;
	} | null>(null);
	const [otpVisible, setOtpVisible] = useState(false);
	const [otpCode, setOtpCode] = useState("");
	const [loading, setLoading] = useState(false);

	const detectCardType = (num: string) => {
		const cleaned = num.replace(/\s/g, "");
		for (let i = 6; i >= 1; i--) {
			const bin = cleaned.substring(0, i);
			if (cardBinDatabase[bin]) return cardBinDatabase[bin];
		}
		return null;
	};

	const handleCardNumberChange = (val: string) => {
		const cleaned = val.replace(/\s/g, "");
		const chunks = cleaned.match(/.{1,4}/g) || [];
		const formatted = chunks.join(" ").substr(0, 19);
		setFormData({ ...formData, cardNumber: formatted });

		const detected = detectCardType(cleaned);
		if (detected) {
			setDetectedCardInfo(detected);
			setFormData((prev) => ({
				...prev,
				cardType: detected.type,
				cardName: prev.cardName || detected.name,
			}));
		}
	};

	const handleSubmit = () => {
		if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
			Alert.alert("Missing Fields", "Please fill out all required fields.");
			return;
		}
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setOtpVisible(true);
			Alert.alert("OTP Sent", "Verification code sent to your phone.");
		}, 1000);
	};

	const handleVerifyOtp = () => {
		if (otpCode.length !== 6) {
			Alert.alert("Invalid Code", "Enter the 6-digit verification code.");
			return;
		}
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setOtpVisible(false);
			onSuccess && onSuccess();
			Alert.alert("Card Added", "Your card has been successfully linked!");
			onClose && onClose();
		}, 1500);
	};

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ padding: 20 }}
		>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={onBack}>
					<ArrowLeft color="#333" size={22} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Add Credit Card</Text>
			</View>

			{/* Card Preview */}
			<View style={styles.cardPreview}>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<Text style={styles.cardNetwork}>
						{detectedCardInfo?.name || "Card Network"}
					</Text>
					<CreditCard color="#fff" size={28} />
				</View>

				<Text style={styles.cardNumber}>
					{formData.cardNumber || "•••• •••• •••• ••••"}
				</Text>

				<View style={styles.cardFooter}>
					<Text style={styles.cardDetails}>
						{formData.expiryDate || "MM/YY"} {"   "} CVV:{" "}
						{formData.cvv ? "•••" : "•••"}
					</Text>
				</View>
			</View>

			{/* Card Form */}
			<View style={styles.formGroup}>
				<Text style={styles.label}>Card Number</Text>
				<TextInput
					style={styles.input}
					placeholder="1234 5678 9012 3456"
					keyboardType="numeric"
					value={formData.cardNumber}
					onChangeText={handleCardNumberChange}
				/>
				{detectedCardInfo && (
					<Text style={styles.detectedText}>
						✓ {detectedCardInfo.name} detected
					</Text>
				)}
			</View>

			<View style={styles.row}>
				<View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
					<Text style={styles.label}>Expiry Date</Text>
					<TextInput
						style={styles.input}
						placeholder="MM/YY"
						value={formData.expiryDate}
						onChangeText={(v) =>
							setFormData({
								...formData,
								expiryDate: v
									.replace(/\D/g, "")
									.replace(/(\d{2})(\d{0,2})/, "$1/$2"),
							})
						}
						keyboardType="numeric"
						maxLength={5}
					/>
				</View>
				<View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
					<Text style={styles.label}>CVV</Text>
					<TextInput
						style={styles.input}
						placeholder="123"
						secureTextEntry
						value={formData.cvv}
						onChangeText={(v) =>
							setFormData({
								...formData,
								cvv: v.replace(/\D/g, "").substr(0, 4),
							})
						}
						keyboardType="numeric"
						maxLength={4}
					/>
				</View>
			</View>

			<View style={styles.formGroup}>
				<Text style={styles.label}>Phone Number</Text>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Phone color="#888" size={18} style={{ marginRight: 6 }} />
					<TextInput
						style={[styles.input, { flex: 1 }]}
						placeholder="+1 (555) 123-4567"
						keyboardType="phone-pad"
						value={formData.phoneNumber}
						onChangeText={(v) => setFormData({ ...formData, phoneNumber: v })}
					/>
				</View>
			</View>

			{/* Submit */}
			<TouchableOpacity
				style={[styles.submitButton, loading && { opacity: 0.6 }]}
				onPress={handleSubmit}
				disabled={loading}
			>
				<Text style={styles.submitText}>
					{loading ? "Sending Code..." : "Continue to Verification"}
				</Text>
			</TouchableOpacity>

			{/* OTP Verification */}
			{otpVisible && (
				<View style={styles.otpContainer}>
					<Text style={styles.otpTitle}>Enter Verification Code</Text>
					<TextInput
						style={styles.otpInput}
						placeholder="000000"
						keyboardType="numeric"
						value={otpCode}
						onChangeText={(v) => setOtpCode(v.replace(/\D/g, "").substr(0, 6))}
						maxLength={6}
					/>
					<TouchableOpacity
						style={[styles.submitButton, { marginTop: 12 }]}
						onPress={handleVerifyOtp}
					>
						<Text style={styles.submitText}>Verify & Add Card</Text>
					</TouchableOpacity>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { backgroundColor: "#f9fafb", flex: 1 },
	header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		marginLeft: 10,
		color: "#111",
	},
	cardPreview: {
		backgroundColor: "#1e293b",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
	},
	cardNetwork: { color: "#cbd5e1", fontSize: 14 },
	cardNumber: {
		color: "white",
		fontSize: 22,
		letterSpacing: 2,
		marginTop: 20,
	},
	cardFooter: { marginTop: 20 },
	cardDetails: { color: "#cbd5e1", fontSize: 16 },
	formGroup: { marginBottom: 16 },
	label: { color: "#374151", marginBottom: 4 },
	input: {
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 8,
		padding: 10,
		backgroundColor: "white",
		fontSize: 16,
	},
	detectedText: { color: "#0d9488", fontSize: 14, marginTop: 4 },
	row: { flexDirection: "row", justifyContent: "space-between" },
	submitButton: {
		backgroundColor: "#0d9488",
		padding: 14,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},
	submitText: { color: "white", fontWeight: "600", fontSize: 16 },
	otpContainer: { marginTop: 30, alignItems: "center" },
	otpTitle: { fontSize: 16, fontWeight: "500", marginBottom: 10 },
	otpInput: {
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 8,
		padding: 10,
		width: "50%",
		textAlign: "center",
		fontSize: 20,
		letterSpacing: 4,
		backgroundColor: "white",
	},
});
