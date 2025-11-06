import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AIInsightBanner from "../../components/AIInsigntBanner";
import FinanceCard from "../../components/FinanceCard";
import { useAuth } from "../../contexts/AuthContext";

type Txn = {
	id: string;
	title: string;
	subtitle: string;
	amount: number; // negative = expense, positive = income
	icon: keyof typeof Feather.glyphMap;
};

const RECENT_TXNS: Txn[] = [
	{
		id: "1",
		title: "Starbucks",
		subtitle: "Coffee • 9:42 AM",
		amount: -6.25,
		icon: "coffee" as any,
	}, // feather doesn't have coffee; fallback to "cup" if you have a custom set
	{
		id: "2",
		title: "Salary",
		subtitle: "Oct Payroll",
		amount: 3200,
		icon: "dollar-sign",
	},
	{
		id: "3",
		title: "Netflix",
		subtitle: "Subscription",
		amount: -15.99,
		icon: "film",
	},
	{
		id: "4",
		title: "Whole Foods",
		subtitle: "Groceries",
		amount: -82.33,
		icon: "shopping-bag",
	},
	{
		id: "5",
		title: "Gas Rebate",
		subtitle: "Rewards",
		amount: 12.5,
		icon: "gift",
	},
];

export default function HomeScreen() {
	const { user } = useAuth();

	const greeting = useMemo(() => {
		const hr = new Date().getHours();
		if (hr < 12) return "Good Morning";
		if (hr < 18) return "Good Afternoon";
		return "Good Evening";
	}, []);

	return (
		<SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
			{/* Gradient header with large rounded bottom corners */}
			<LinearGradient
				colors={["#14b8a6", "#0d9488"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.header}
			>
				<View style={styles.headerRow}>
					<View>
						<Text style={styles.greeting}>{greeting}</Text>
						<Text style={styles.name}>{user?.name ?? "Sarah"}</Text>
					</View>
					<View style={styles.helloBubble}>
						<Text style={{ fontSize: 22 }}>👋</Text>
					</View>
				</View>

				<AIInsightBanner
					message="You saved $40 this week by switching to your Cashback card!"
					type="success"
				/>
			</LinearGradient>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Total Balance */}
				<View style={[styles.card, styles.totalCard]}>
					<View style={styles.totalRow}>
						<Text style={styles.totalLabel}>Total Balance</Text>
						<Feather name="trending-up" size={20} color="#22c55e" />
					</View>
					<Text style={styles.totalValue}>$24,582.50</Text>
					<Text style={styles.totalDelta}>+ $1,240 this month</Text>
				</View>

				{/* Income / Expenses grid */}
				<View style={styles.grid2}>
					<View style={{ flex: 1 }}>
						<FinanceCard
							title="Income"
							value="$6,500"
							subtitle="This month"
							icon={<Feather name="briefcase" size={20} color="#0d9488" />}
							trend="up"
							trendValue="+12%"
						/>
					</View>
					<View style={{ flex: 1 }}>
						<FinanceCard
							title="Expenses"
							value="$3,245"
							subtitle="This month"
							icon={<Feather name="calendar" size={20} color="#0d9488" />}
							trend="down"
							trendValue="-8%"
						/>
					</View>
				</View>

				{/* Quick Actions */}
				<View style={{ gap: 12 }}>
					<Text style={styles.sectionTitle}>Quick Actions</Text>

					<View style={[styles.card]}>
						<View style={styles.rowHeader}>
							<Text style={styles.rowHeaderTitle}>Upcoming Bills</Text>
							<Feather name="calendar" size={18} color="#0d9488" />
						</View>
						<Text style={styles.rowPrimaryValue}>$342.50</Text>
						<Text style={styles.rowSub}>3 bills due this week</Text>
					</View>

					<View style={[styles.card]}>
						<View style={styles.rowHeader}>
							<Text style={styles.rowHeaderTitle}>Active Subscriptions</Text>
							<Feather name="repeat" size={18} color="#0d9488" />
						</View>
						<Text style={styles.rowPrimaryValue}>12 services</Text>
						<Text style={styles.rowSub}>$89.99/month total</Text>
					</View>

					<View style={[styles.card]}>
						<View style={styles.rowHeader}>
							<Text style={styles.rowHeaderTitle}>Rewards Available</Text>
							<Feather name="gift" size={18} color="#0d9488" />
						</View>
						<Text style={styles.rowPrimaryValue}>$156</Text>
						<Text style={styles.rowSub}>From 3 credit cards</Text>
					</View>
				</View>

				{/* Recent Transactions */}
				<View style={{ gap: 12 }}>
					<Text style={styles.sectionTitle}>Recent Transactions</Text>

					<View style={styles.card}>
						{RECENT_TXNS.map((t, idx) => {
							const isLast = idx === RECENT_TXNS.length - 1;
							const amountStr =
								(t.amount < 0 ? "-$" : "+$") + Math.abs(t.amount).toFixed(2);

							return (
								<View
									key={t.id}
									style={[styles.txnRow, !isLast && styles.txnDivider]}
								>
									<View style={styles.txnIconWrap}>
										<Feather
											name={t.icon in Feather.glyphMap ? t.icon : "tag"}
											size={18}
											color="#0f766e"
										/>
									</View>

									<View style={{ flex: 1 }}>
										<Text style={styles.txnTitle}>{t.title}</Text>
										<Text style={styles.txnSub}>{t.subtitle}</Text>
									</View>

									<Text
										style={[
											styles.txnAmount,
											{ color: t.amount < 0 ? "#dc2626" : "#16a34a" },
										]}
									>
										{amountStr}
									</Text>
								</View>
							);
						})}
					</View>
				</View>

				{/* Forecast info card */}
				<View style={[styles.card, styles.infoCard]}>
					<View style={styles.infoIconWrap}>
						<Feather name="trending-up" size={20} color="#fff" />
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.infoTitle}>Financial Forecast</Text>
						<Text style={styles.infoBody}>
							Based on your spending, you&#39;ll have $2,400 extra by Dec 15
						</Text>
						<Text style={styles.infoLink}>View Forecast →</Text>
					</View>
				</View>

				{/* bottom spacer so content never hides behind the tab bar */}
				<View style={{ height: 28 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const R = 28; // big radius for header & top card corners

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#f1f5f9" }, // slate-100 background like mock

	/* Header */
	header: {
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 22, // a bit more space
		borderBottomLeftRadius: 28,
		borderBottomRightRadius: 28,
		overflow: "hidden", // ✅ keeps the banner inside the rounded header
	},

	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	greeting: { color: "rgba(255,255,255,0.9)", fontSize: 14, marginBottom: 6 },
	name: { color: "#fff", fontSize: 28, fontWeight: "800" },
	helloBubble: {
		width: 44,
		height: 44,
		borderRadius: 9999,
		backgroundColor: "rgba(255,255,255,0.25)",
		alignItems: "center",
		justifyContent: "center",
	},

	/* Main content spacing: pull the first card up like your mock */
	content: {
		paddingHorizontal: 18,
		paddingTop: -R, // not supported; simulate with negative margin on first card
		paddingBottom: 24,
		gap: 16,
	},

	/* Generic card surface */
	card: {
		backgroundColor: "#fff",
		borderRadius: 18,
		padding: 16,
		borderWidth: 1,
		borderColor: "#e2e8f0", // slate-200
		shadowColor: "#000",
		shadowOpacity: 0.06,
		shadowRadius: 8,
		elevation: 2,
	},

	/* Total balance card sits under header with overlap */
	totalCard: {
		marginTop: 18, // was bigger; this is a subtle overlap
		borderRadius: 22,
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 4 },
		elevation: 4,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	totalLabel: { color: "#475569", fontSize: 14 },
	totalValue: {
		color: "#0f172a",
		fontSize: 34,
		fontWeight: "800",
		marginBottom: 4,
	},
	totalDelta: { color: "#16a34a", fontSize: 13, fontWeight: "600" },

	/* Two-column cards */
	grid2: { flexDirection: "row", gap: 12 },

	sectionTitle: { color: "#0f172a", fontSize: 18, fontWeight: "700" },

	/* Quick action rows inside cards */
	rowHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	rowHeaderTitle: { color: "#0f172a", fontWeight: "700" },
	rowPrimaryValue: {
		color: "#0f172a",
		fontSize: 24,
		fontWeight: "800",
		marginTop: 6,
	},
	rowSub: { color: "#64748b", marginTop: 4 },

	/* Recent transactions */
	txnRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
	},
	txnDivider: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
	txnIconWrap: {
		width: 42,
		height: 42,
		borderRadius: 12,
		backgroundColor: "#ecfeff", // teal-50-ish
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	txnTitle: { color: "#0f172a", fontWeight: "700" },
	txnSub: { color: "#64748b", marginTop: 2, fontSize: 12 },
	txnAmount: { fontWeight: "800", fontSize: 16 },

	/* Info card */
	infoCard: {
		flexDirection: "row",
		gap: 12,
		alignItems: "flex-start",
	},
	infoIconWrap: {
		width: 42,
		height: 42,
		borderRadius: 12,
		backgroundColor: "#3b82f6",
		alignItems: "center",
		justifyContent: "center",
	},
	infoTitle: { color: "#0f172a", fontWeight: "800", marginBottom: 4 },
	infoBody: { color: "#475569", lineHeight: 20, marginBottom: 8 },
	infoLink: { color: "#2563eb", fontWeight: "700" },
});
