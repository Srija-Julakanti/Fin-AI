// app/credit-cards.tsx  (or wherever you want this screen to live)
import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import {
	CreditCard as CardIcon,
	Star,
	Calendar,
	Sparkles,
	Plus,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

type CardItem = {
	name: string;
	last4: string;
	colors: [string, string]; // gradient from,to
	balance: number;
	limit: number;
	rewards: number;
	rewardsType: "points" | "cashback" | "miles";
	dueDate: string;
	bestFor: string[];
};

export default function Cards() {
	const cards: CardItem[] = [
		{
			name: "Chase Sapphire",
			last4: "4532",
			colors: ["#3B82F6", "#4F46E5"], // from-blue-500 to-indigo-600
			balance: 1240.5,
			limit: 10000,
			rewards: 12450,
			rewardsType: "points",
			dueDate: "Nov 15",
			bestFor: ["Travel", "Dining"],
		},
		{
			name: "American Express",
			last4: "8821",
			colors: ["#22C55E", "#0D9488"], // from-green-500 to-teal-600
			balance: 542.3,
			limit: 5000,
			rewards: 156.2,
			rewardsType: "cashback",
			dueDate: "Nov 20",
			bestFor: ["Groceries", "Gas"],
		},
		{
			name: "Capital One",
			last4: "2910",
			colors: ["#A855F7", "#DB2777"], // from-purple-500 to-pink-600
			balance: 0,
			limit: 8000,
			rewards: 8920,
			rewardsType: "miles",
			dueDate: "Nov 12",
			bestFor: ["Shopping", "Entertainment"],
		},
	];

	const recommendations = [
		{ category: "Groceries", card: "American Express", reward: "3% cashback" },
		{ category: "Travel", card: "Chase Sapphire", reward: "5x points" },
		{ category: "Dining", card: "Chase Sapphire", reward: "3x points" },
		{ category: "Gas", card: "American Express", reward: "2% cashback" },
	];

	return (
		<View style={styles.screen}>
			<View style={styles.header}>
				<Text style={styles.title}>Credit Cards</Text>
				<Text style={styles.subtitle}>Optimize your rewards and payments</Text>
			</View>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* AI Insight banner (simple RN version) */}
				<View style={styles.banner}>
					<Text style={styles.bannerIcon}>💡</Text>
					<Text style={styles.bannerText}>
						Using Chase Sapphire for your upcoming flight could earn you 2,500
						bonus points!
					</Text>
				</View>

				{/* Your Cards */}
				<View>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Your Cards</Text>
						<TouchableOpacity
							style={styles.plusBtn}
							onPress={() => router.push("../add-card")}
							accessibilityRole="button"
							accessibilityLabel="Add card"
						>
							<Plus size={18} color="#0F766E" />
							<Text style={styles.plusBtnText}>Add</Text>
						</TouchableOpacity>
					</View>

					<View style={{ gap: 16 }}>
						{cards.map((card, index) => (
							<View key={`${card.name}-${card.last4}-${index}`}>
								<LinearGradient
									colors={card.colors}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.card}
								>
									<View style={styles.cardTop}>
										<View>
											<Text style={styles.cardBrand}>{card.name}</Text>
											<Text style={styles.cardNumber}>•••• {card.last4}</Text>
										</View>
										<CardIcon size={32} color="rgba(255,255,255,0.8)" />
									</View>

									<View style={styles.cardStats}>
										<View>
											<Text style={styles.statLabel}>Balance</Text>
											<Text style={styles.statValue}>
												${card.balance.toFixed(2)}
											</Text>
										</View>
										<View>
											<Text style={styles.statLabel}>Limit</Text>
											<Text style={styles.statValue}>
												${card.limit.toLocaleString()}
											</Text>
										</View>
									</View>
								</LinearGradient>

								<View style={styles.cardInfo}>
									<View style={styles.rowBetween}>
										<View style={styles.rowCenter}>
											<Star size={16} color="#F59E0B" fill="#F59E0B" />
											<Text style={styles.rewardsText}>
												{"  "}
												{card.rewards.toLocaleString()} {card.rewardsType}
											</Text>
										</View>
										<View style={styles.rowCenter}>
											<Calendar size={16} color="#4B5563" />
											<Text style={styles.dueText}>
												{"  "}Due {card.dueDate}
											</Text>
										</View>
									</View>

									<View style={styles.chipsWrap}>
										{card.bestFor.map((category) => (
											<View
												key={`${card.last4}-${category}`}
												style={styles.chip}
											>
												<Text style={styles.chipText}>Best for {category}</Text>
											</View>
										))}
									</View>

									{card.balance > 0 && (
										<TouchableOpacity style={styles.payBtn}>
											<Text style={styles.payBtnText}>
												Pay ${card.balance.toFixed(2)}
											</Text>
										</TouchableOpacity>
									)}
								</View>
							</View>
						))}
					</View>
				</View>

				{/* AI Recommendations */}
				<View>
					<View style={[styles.rowCenter, { gap: 8, marginBottom: 12 }]}>
						<Sparkles size={20} color="#0D9488" />
						<Text style={styles.sectionTitle}>AI Recommendations</Text>
					</View>

					<View style={styles.recBox}>
						{recommendations.map((rec, index) => (
							<View
								key={`${rec.category}-${index}`}
								style={[
									styles.recRow,
									index < recommendations.length - 1 && styles.recRowBorder,
								]}
							>
								<View style={{ flex: 1 }}>
									<Text style={styles.recCategory}>{rec.category}</Text>
									<Text style={styles.recSub}>Use {rec.card}</Text>
								</View>
								<View style={styles.rewardPill}>
									<Star size={12} color="#16A34A" fill="#16A34A" />
									<Text style={styles.rewardPillText}>
										{"  "}
										{rec.reward}
									</Text>
								</View>
							</View>
						))}
					</View>
				</View>

				{/* Total Rewards */}
				<View style={styles.totalBox}>
					<Text style={styles.totalTitle}>Total Rewards Available</Text>
					<Text style={styles.totalValue}>$326.70</Text>
					<Text style={styles.totalSub}>Equivalent value across all cards</Text>
					<TouchableOpacity style={styles.redeemBtn}>
						<Text style={styles.redeemBtnText}>Redeem Rewards</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#F9FAFB" },
	header: {
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 24,
		paddingTop: 48,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	title: { fontSize: 24, fontWeight: "600", color: "#111827", marginBottom: 4 },
	subtitle: { color: "#6B7280" },

	content: {
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 24,
		gap: 24,
	},

	banner: {
		backgroundColor: "#ECFEFF",
		borderColor: "#CFFAFE",
		borderWidth: 1,
		padding: 12,
		borderRadius: 16,
		flexDirection: "row",
		gap: 8,
	},
	bannerIcon: { fontSize: 16 },
	bannerText: { flex: 1, color: "#0E7490" },

	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	sectionTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
	plusBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: "#ECFDF5",
		borderWidth: 1,
		borderColor: "#A7F3D0",
	},
	plusBtnText: { color: "#0F766E", fontWeight: "600" },

	card: {
		borderRadius: 20,
		padding: 20,
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowRadius: 8,
		marginBottom: 8,
	},
	cardTop: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		marginBottom: 24,
	},
	cardBrand: { color: "rgba(255,255,255,0.9)", fontSize: 12, marginBottom: 4 },
	cardNumber: { color: "#fff", fontSize: 18, fontWeight: "600" },
	cardStats: { flexDirection: "row", gap: 32 },
	statLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginBottom: 4 },
	statValue: { color: "#fff", fontSize: 18, fontWeight: "600" },

	cardInfo: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 16,
		marginTop: -12,
		borderWidth: 1,
		borderColor: "#F3F4F6",
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 6,
	},
	rowBetween: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	rowCenter: { flexDirection: "row", alignItems: "center" },
	rewardsText: { color: "#374151" },
	dueText: { color: "#4B5563" },

	chipsWrap: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginBottom: 10,
	},
	chip: {
		backgroundColor: "#F3F4F6",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
	},
	chipText: { color: "#374151", fontSize: 12 },

	payBtn: {
		backgroundColor: "#0D9488",
		paddingVertical: 10,
		borderRadius: 10,
		alignItems: "center",
	},
	payBtnText: { color: "#fff", fontWeight: "600" },

	recBox: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "#F3F4F6",
	},
	recRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
	},
	recRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
	recCategory: { fontWeight: "600", color: "#111827", marginBottom: 2 },
	recSub: { color: "#6B7280", fontSize: 12 },
	rewardPill: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingVertical: 6,
		backgroundColor: "#ECFDF5",
		borderRadius: 999,
	},
	rewardPillText: { color: "#15803D", fontWeight: "600", fontSize: 12 },

	totalBox: {
		backgroundColor: "#ECFDF5",
		borderColor: "#D1FAE5",
		borderWidth: 1,
		borderRadius: 16,
		padding: 20,
	},
	totalTitle: { fontWeight: "600", color: "#111827", marginBottom: 6 },
	totalValue: {
		fontSize: 32,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 4,
	},
	totalSub: { color: "#6B7280", marginBottom: 12 },
	redeemBtn: {
		backgroundColor: "#0D9488",
		paddingVertical: 14,
		borderRadius: 14,
		alignItems: "center",
	},
	redeemBtnText: { color: "#fff", fontWeight: "700" },
});
