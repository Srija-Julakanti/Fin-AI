import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from "react-native";
import {
	Sparkles,
	TrendingUp,
	Calendar,
	CreditCard,
	MessageCircle,
	Plus,
	Wallet,
} from "lucide-react-native";

interface HomeDashboardProps {
	onNavigate: (screen: string) => void;
}

export default function HomeDashboard({ onNavigate }: HomeDashboardProps) {
	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingBottom: 120 }}
		>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<Text style={styles.headerTitle}>Good morning, Alex</Text>
					<TouchableOpacity
						style={[styles.button, styles.buttonOutline]}
						onPress={() => onNavigate("add-expense")}
					>
						<Plus color="#0f766e" size={18} />
						<Text style={styles.buttonText}>Add Expense</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.savingsCard}>
					<View style={styles.iconCircle}>
						<Sparkles color="#fff" size={18} />
					</View>
					<Text style={styles.savingsText}>You saved $40 this week!</Text>
				</View>
			</View>

			{/* Total Balance */}
			<View style={[styles.card, styles.balanceCard]}>
				<Text style={styles.balanceLabel}>Total Balance</Text>
				<Text style={styles.balanceAmount}>$12,847.52</Text>
				<View style={styles.trendRow}>
					<TrendingUp color="#34d399" size={16} />
					<Text style={styles.trendText}>+2.4% this month</Text>
				</View>
			</View>

			{/* Quick Stats */}
			<View style={styles.row}>
				<TouchableOpacity
					style={[styles.card, styles.statCard]}
					onPress={() => onNavigate("budget")}
				>
					<View style={[styles.iconBox, { backgroundColor: "#ccfbf1" }]}>
						<Wallet color="#0d9488" size={20} />
					</View>
					<Text style={styles.cardLabel}>Budget Left</Text>
					<Text style={styles.cardValue}>$1,179</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.card, styles.statCard]}
					onPress={() => onNavigate("forecast")}
				>
					<View style={[styles.iconBox, { backgroundColor: "#bfdbfe" }]}>
						<Calendar color="#2563eb" size={20} />
					</View>
					<Text style={styles.cardLabel}>This Month</Text>
					<Text style={styles.cardValue}>$1,821</Text>
				</TouchableOpacity>
			</View>

			{/* Credit Card Rewards */}
			<TouchableOpacity
				style={[styles.card, styles.rewardsCard]}
				onPress={() => onNavigate("cards")}
			>
				<View style={styles.rewardsRow}>
					<View>
						<Text style={styles.rewardsLabel}>Credit Card Rewards</Text>
						<Text style={styles.rewardsAmount}>$127</Text>
						<Text style={styles.rewardsSub}>Available to redeem</Text>
					</View>
					<CreditCard color="#fff" size={48} />
				</View>
			</TouchableOpacity>

			{/* AI Insights */}
			<View style={{ marginTop: 16 }}>
				<Text style={styles.sectionTitle}>AI Insights</Text>

				<View
					style={[
						styles.card,
						styles.insightCard,
						{ borderLeftColor: "#14b8a6" },
					]}
				>
					<View style={styles.insightRow}>
						<View>
							<Text style={styles.insightTitle}>
								Unused Subscription Detected
							</Text>
							<Text style={styles.insightSubtitle}>
								You have not used HBO Max in 60 days
							</Text>
						</View>
						<TouchableOpacity>
							<Text style={[styles.actionText, { color: "#14b8a6" }]}>
								Review
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View
					style={[
						styles.card,
						styles.insightCard,
						{ borderLeftColor: "#3b82f6" },
					]}
				>
					<View style={styles.insightRow}>
						<View>
							<Text style={styles.insightTitle}>Better Card for Groceries</Text>
							<Text style={styles.insightSubtitle}>
								Use Chase Freedom for 5% cashback
							</Text>
						</View>
						<TouchableOpacity>
							<Text style={[styles.actionText, { color: "#3b82f6" }]}>
								View
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			{/* Floating Chat Button */}
			<TouchableOpacity style={styles.chatButton}>
				<MessageCircle color="#fff" size={28} />
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
		padding: 16,
	},
	header: {
		marginBottom: 16,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#1e293b",
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 8,
		paddingVertical: 6,
		paddingHorizontal: 10,
	},
	buttonOutline: {
		borderWidth: 1,
		borderColor: "#0f766e",
	},
	buttonText: {
		color: "#0f766e",
		fontWeight: "500",
		marginLeft: 6,
	},
	savingsCard: {
		backgroundColor: "#0d9488",
		flexDirection: "row",
		alignItems: "center",
		marginTop: 12,
		borderRadius: 16,
		padding: 12,
	},
	iconCircle: {
		backgroundColor: "rgba(255,255,255,0.2)",
		padding: 6,
		borderRadius: 50,
		marginRight: 8,
	},
	savingsText: {
		color: "#fff",
		fontSize: 15,
	},
	card: {
		borderRadius: 16,
		padding: 16,
		backgroundColor: "#fff",
		marginTop: 12,
	},
	balanceCard: {
		backgroundColor: "#1e293b",
	},
	balanceLabel: {
		color: "#cbd5e1",
	},
	balanceAmount: {
		color: "#fff",
		fontSize: 32,
		fontWeight: "700",
		marginVertical: 4,
	},
	trendRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	trendText: {
		color: "#34d399",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	statCard: {
		flex: 1,
		marginHorizontal: 4,
	},
	iconBox: {
		width: 40,
		height: 40,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	cardLabel: {
		color: "#475569",
	},
	cardValue: {
		color: "#0f172a",
		fontSize: 22,
		fontWeight: "600",
	},
	rewardsCard: {
		backgroundColor: "#f59e0b",
	},
	rewardsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	rewardsLabel: {
		color: "#fff",
		opacity: 0.9,
	},
	rewardsAmount: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "700",
	},
	rewardsSub: {
		color: "#fff",
		opacity: 0.8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
		color: "#1e293b",
	},
	insightCard: {
		borderLeftWidth: 4,
		marginBottom: 10,
	},
	insightRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	insightTitle: {
		fontSize: 16,
		color: "#0f172a",
		fontWeight: "600",
	},
	insightSubtitle: {
		color: "#64748b",
		marginTop: 2,
	},
	actionText: {
		fontWeight: "500",
	},
	chatButton: {
		position: "absolute",
		bottom: 40,
		right: 24,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#0d9488",
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
});
