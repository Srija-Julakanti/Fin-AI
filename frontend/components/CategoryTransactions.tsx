import { Button } from "./ui/button";
import FinAICard from "./shared/FinAICard";
import {
	ArrowLeft,
	Calendar,
	ShoppingCart,
	Car,
	Home,
	Smartphone,
	Coffee,
	MoreHorizontal,
} from "lucide-react-native";

interface CategoryTransactionsProps {
	category: string;
	onBack: () => void;
}

const categoryData: Record<
	string,
	{ icon: any; color: string; transactions: any[] }
> = {
	Groceries: {
		icon: ShoppingCart,
		color: "#10b981",
		transactions: [
			{
				merchant: "Whole Foods Market",
				amount: 87.43,
				date: "Nov 2, 2025",
				time: "10:30 AM",
				type: "card",
			},
			{
				merchant: "Trader Joe's",
				amount: 52.18,
				date: "Nov 1, 2025",
				time: "3:45 PM",
				type: "card",
			},
			{
				merchant: "Local Farmers Market",
				amount: 35.0,
				date: "Oct 30, 2025",
				time: "9:00 AM",
				type: "cash",
			},
			{
				merchant: "Safeway",
				amount: 94.32,
				date: "Oct 28, 2025",
				time: "5:20 PM",
				type: "card",
			},
			{
				merchant: "Target Groceries",
				amount: 118.09,
				date: "Oct 25, 2025",
				time: "2:15 PM",
				type: "card",
			},
		],
	},
	Transportation: {
		icon: Car,
		color: "#3b82f6",
		transactions: [
			{
				merchant: "Shell Gas Station",
				amount: 65.0,
				date: "Nov 2, 2025",
				time: "8:15 AM",
				type: "card",
			},
			{
				merchant: "Uber",
				amount: 24.5,
				date: "Nov 1, 2025",
				time: "9:30 PM",
				type: "card",
			},
			{
				merchant: "Metro Transit Pass",
				amount: 95.0,
				date: "Nov 1, 2025",
				time: "7:00 AM",
				type: "card",
			},
			{
				merchant: "Chevron",
				amount: 61.0,
				date: "Oct 28, 2025",
				time: "6:45 PM",
				type: "card",
			},
		],
	},
	"Bills & Utilities": {
		icon: Home,
		color: "#f59e0b",
		transactions: [
			{
				merchant: "Electric Company",
				amount: 156.78,
				date: "Nov 1, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Internet Service",
				amount: 79.99,
				date: "Nov 1, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Water & Sewage",
				amount: 67.45,
				date: "Oct 30, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Gas Company",
				amount: 89.23,
				date: "Oct 28, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Phone Bill",
				amount: 65.0,
				date: "Oct 25, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Home Insurance",
				amount: 176.0,
				date: "Oct 20, 2025",
				time: "Auto-pay",
				type: "card",
			},
		],
	},
	Subscriptions: {
		icon: Smartphone,
		color: "#8b5cf6",
		transactions: [
			{
				merchant: "Netflix",
				amount: 15.99,
				date: "Nov 1, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Spotify Premium",
				amount: 9.99,
				date: "Nov 1, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Adobe Creative Cloud",
				amount: 54.99,
				date: "Oct 30, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Amazon Prime",
				amount: 14.99,
				date: "Oct 28, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "iCloud Storage",
				amount: 2.99,
				date: "Oct 25, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Apple Fitness+",
				amount: 9.99,
				date: "Oct 25, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "HBO Max",
				amount: 14.99,
				date: "Oct 20, 2025",
				time: "Auto-pay",
				type: "card",
			},
			{
				merchant: "Nintendo Switch Online",
				amount: 19.99,
				date: "Oct 15, 2025",
				time: "Auto-pay",
				type: "card",
			},
		],
	},
	"Dining Out": {
		icon: Coffee,
		color: "#ec4899",
		transactions: [
			{
				merchant: "Starbucks",
				amount: 12.45,
				date: "Nov 2, 2025",
				time: "8:00 AM",
				type: "card",
			},
			{
				merchant: "Thai Kitchen Restaurant",
				amount: 67.89,
				date: "Nov 1, 2025",
				time: "7:30 PM",
				type: "card",
			},
			{
				merchant: "Pizza Place",
				amount: 28.5,
				date: "Oct 30, 2025",
				time: "6:15 PM",
				type: "card",
			},
			{
				merchant: "Local Cafe",
				amount: 8.75,
				date: "Oct 29, 2025",
				time: "9:30 AM",
				type: "cash",
			},
			{
				merchant: "Chipotle",
				amount: 15.2,
				date: "Oct 28, 2025",
				time: "12:45 PM",
				type: "card",
			},
			{
				merchant: "Fine Dining Restaurant",
				amount: 145.6,
				date: "Oct 25, 2025",
				time: "8:00 PM",
				type: "card",
			},
		],
	},
	Other: {
		icon: MoreHorizontal,
		color: "#6b7280",
		transactions: [
			{
				merchant: "Amazon Shopping",
				amount: 87.99,
				date: "Nov 1, 2025",
				time: "2:30 PM",
				type: "card",
			},
			{
				merchant: "Movie Tickets",
				amount: 32.0,
				date: "Oct 30, 2025",
				time: "7:00 PM",
				type: "card",
			},
			{
				merchant: "Pharmacy",
				amount: 24.56,
				date: "Oct 28, 2025",
				time: "4:20 PM",
				type: "card",
			},
			{
				merchant: "Bookstore",
				amount: 45.99,
				date: "Oct 26, 2025",
				time: "11:30 AM",
				type: "card",
			},
			{
				merchant: "Pet Supplies",
				amount: 43.85,
				date: "Oct 24, 2025",
				time: "3:15 PM",
				type: "card",
			},
		],
	},
};

export default function CategoryTransactions({
	category,
	onBack,
}: CategoryTransactionsProps) {
	const data = categoryData[category];
	if (!data) return null;

	const Icon = data.icon;
	const totalSpent = data.transactions.reduce((sum, t) => sum + t.amount, 0);

	return (
		<div className="min-h-screen p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={onBack}
					className="dark:text-slate-300"
				>
					<ArrowLeft className="w-5 h-5" />
				</Button>
				<div className="flex-1">
					<h1 className="text-slate-800 dark:text-slate-100">{category}</h1>
					<p className="text-slate-600 dark:text-slate-400">
						{data.transactions.length} transactions
					</p>
				</div>
			</div>

			{/* Category Summary */}
			<FinAICard className="bg-white dark:bg-slate-800">
				<div className="flex items-center gap-4">
					<div
						className="w-16 h-16 rounded-2xl flex items-center justify-center"
						style={{ backgroundColor: data.color }}
					>
						<Icon className="w-8 h-8 text-white" />
					</div>
					<div className="flex-1">
						<p className="text-slate-600 dark:text-slate-400">Total Spent</p>
						<p className="text-slate-900 dark:text-slate-100 text-3xl">
							${totalSpent.toFixed(2)}
						</p>
					</div>
				</div>
			</FinAICard>

			{/* Transactions List */}
			<div className="space-y-3">
				<h3 className="text-slate-800 dark:text-slate-100">All Transactions</h3>
				{data.transactions.map((transaction, index) => (
					<FinAICard key={index} className="bg-white dark:bg-slate-800">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<p className="text-slate-900 dark:text-slate-100">
										{transaction.merchant}
									</p>
									{transaction.type === "cash" && (
										<span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
											Cash
										</span>
									)}
								</div>
								<div className="flex items-center gap-3 mt-1">
									<div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
										<Calendar className="w-3 h-3" />
										<span>{transaction.date}</span>
									</div>
									<span className="text-slate-400 dark:text-slate-500">•</span>
									<span className="text-slate-600 dark:text-slate-400 text-sm">
										{transaction.time}
									</span>
								</div>
							</div>
							<div className="text-right">
								<p className="text-slate-900 dark:text-slate-100 text-xl">
									${transaction.amount.toFixed(2)}
								</p>
							</div>
						</div>
					</FinAICard>
				))}
			</div>

			{/* Export Option */}
			<Button
				variant="outline"
				className="w-full dark:border-slate-600 dark:text-slate-300"
			>
				Export Transactions
			</Button>
		</div>
	);
}
