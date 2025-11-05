import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from "react-native";
import {
	ArrowLeft,
	Wallet,
	Calendar as CalendarIcon,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AddExpenseScreenProps {
	onBack?: () => void;
	onSuccess?: () => void;
	onClose?: () => void;
}

export default function AddExpenseScreen({
	onBack,
	onSuccess,
}: AddExpenseScreenProps) {
	const [formData, setFormData] = useState({
		amount: "",
		category: "",
		description: "",
		date: new Date(),
		paymentMethod: "cash",
	});

	const [showDatePicker, setShowDatePicker] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const categories = [
		"Groceries",
		"Transportation",
		"Bills & Utilities",
		"Dining Out",
		"Healthcare",
		"Shopping",
		"Entertainment",
		"Other",
	];

	const handleSubmit = () => {
		setIsSubmitting(true);
		setTimeout(() => {
			setIsSubmitting(false);
			onSuccess && onSuccess();
		}, 1000);
	};

	return (
		<ScrollView style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={onBack} style={styles.backButton}>
					<ArrowLeft color="#555" size={22} />
				</TouchableOpacity>
				<View style={{ flex: 1 }}>
					<Text style={styles.headerTitle}>Add Expense</Text>
					<Text style={styles.headerSubtitle}>
						Track your cash and other expenses
					</Text>
				</View>
			</View>

			{/* Amount Card */}
			<View style={styles.amountCard}>
				<Wallet
					color="rgba(255,255,255,0.7)"
					size={42}
					style={styles.amountIcon}
				/>
				<Text style={styles.amountLabel}>Amount</Text>
				<Text style={styles.amountValue}>${formData.amount || "0.00"}</Text>
			</View>

			{/* Form */}
			<View style={styles.card}>
				<Text style={styles.label}>Amount</Text>
				<View style={styles.amountInputRow}>
					<Text style={styles.dollarSign}>$</Text>
					<TextInput
						style={styles.input}
						keyboardType="numeric"
						placeholder="0.00"
						value={formData.amount}
						onChangeText={(text) => setFormData({ ...formData, amount: text })}
					/>
				</View>

				<Text style={styles.label}>Category</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter category"
					value={formData.category}
					onChangeText={(text) => setFormData({ ...formData, category: text })}
				/>

				<Text style={styles.label}>Payment Method</Text>
				<TextInput
					style={styles.input}
					placeholder="Cash / Credit / Debit"
					value={formData.paymentMethod}
					onChangeText={(text) =>
						setFormData({ ...formData, paymentMethod: text })
					}
				/>

				<Text style={styles.label}>Date</Text>
				<TouchableOpacity
					style={styles.dateButton}
					onPress={() => setShowDatePicker(true)}
				>
					<CalendarIcon color="#0f766e" size={18} />
					<Text style={styles.dateText}>
						{formData.date.toLocaleDateString()}
					</Text>
				</TouchableOpacity>

				{showDatePicker && (
					<DateTimePicker
						value={formData.date}
						mode="date"
						display="default"
						onChange={(event, selectedDate) => {
							setShowDatePicker(false);
							if (selectedDate) {
								setFormData({ ...formData, date: selectedDate });
							}
						}}
					/>
				)}

				<Text style={styles.label}>Description (Optional)</Text>
				<TextInput
					style={[styles.input, styles.textArea]}
					multiline
					numberOfLines={3}
					placeholder="Add a note about this expense..."
					value={formData.description}
					onChangeText={(text) =>
						setFormData({ ...formData, description: text })
					}
				/>
			</View>

			{/* Buttons */}
			<View style={styles.buttonRow}>
				<TouchableOpacity
					style={[styles.button, styles.cancelButton]}
					onPress={onBack}
				>
					<Text style={styles.cancelText}>Cancel</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.button, styles.submitButton]}
					onPress={handleSubmit}
					disabled={isSubmitting}
				>
					<Text style={styles.submitText}>
						{isSubmitting ? "Adding..." : "Add Expense"}
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f9fafb",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	backButton: {
		marginRight: 10,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#111827",
	},
	headerSubtitle: {
		fontSize: 14,
		color: "#6b7280",
	},
	amountCard: {
		backgroundColor: "#0f766e",
		borderRadius: 12,
		paddingVertical: 30,
		alignItems: "center",
		marginBottom: 20,
	},
	amountIcon: { marginBottom: 10 },
	amountLabel: {
		color: "rgba(255,255,255,0.8)",
		fontSize: 14,
	},
	amountValue: {
		color: "#fff",
		fontSize: 40,
		fontWeight: "bold",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
		elevation: 2,
	},
	label: {
		fontSize: 14,
		fontWeight: "500",
		color: "#374151",
		marginBottom: 6,
	},
	amountInputRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	dollarSign: {
		fontSize: 18,
		color: "#6b7280",
		marginRight: 4,
	},
	input: {
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		fontSize: 16,
		color: "#111827",
		marginBottom: 12,
	},
	textArea: {
		height: 80,
		textAlignVertical: "top",
	},
	dateButton: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 8,
		padding: 10,
		marginBottom: 12,
	},
	dateText: {
		marginLeft: 8,
		fontSize: 16,
		color: "#374151",
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	button: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: "center",
		marginHorizontal: 4,
	},
	cancelButton: {
		backgroundColor: "#f3f4f6",
	},
	submitButton: {
		backgroundColor: "#0f766e",
	},
	cancelText: {
		color: "#374151",
		fontSize: 16,
		fontWeight: "500",
	},
	submitText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
