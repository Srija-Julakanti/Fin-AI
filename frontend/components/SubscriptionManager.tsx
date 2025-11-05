import { Button } from "./ui/button";
import FinAICard from "./shared/FinAICard";
import { Badge } from "./ui/badge";
import {
	AlertCircle,
	Music,
	Film,
	Tv,
	Dumbbell,
	Cloud,
	Coffee,
	ShoppingBag,
	Gamepad2,
} from "lucide-react-native";

interface SubscriptionManagerProps {
	onBack?: () => void;
}

export default function SubscriptionManager({
	onBack,
}: SubscriptionManagerProps) {
	const subscriptions = [
		{
			name: "Spotify Premium",
			price: 9.99,
			icon: Music,
			color: "bg-green-500",
			status: "active",
			lastUsed: "2 days ago",
		},
		{
			name: "Netflix",
			price: 15.99,
			icon: Film,
			color: "bg-red-500",
			status: "active",
			lastUsed: "1 day ago",
		},
		{
			name: "HBO Max",
			price: 14.99,
			icon: Tv,
			color: "bg-purple-600",
			status: "unused",
			lastUsed: "60 days ago",
		},
		{
			name: "Apple Fitness+",
			price: 9.99,
			icon: Dumbbell,
			color: "bg-pink-500",
			status: "active",
			lastUsed: "5 days ago",
		},
		{
			name: "iCloud Storage",
			price: 2.99,
			icon: Cloud,
			color: "bg-blue-500",
			status: "active",
			lastUsed: "Today",
		},
		{
			name: "Adobe Creative",
			price: 54.99,
			icon: Coffee,
			color: "bg-red-700",
			status: "active",
			lastUsed: "1 day ago",
		},
		{
			name: "Amazon Prime",
			price: 14.99,
			icon: ShoppingBag,
			color: "bg-amber-500",
			status: "active",
			lastUsed: "Today",
		},
		{
			name: "Nintendo Switch",
			price: 19.99,
			icon: Gamepad2,
			color: "bg-red-600",
			status: "unused",
			lastUsed: "45 days ago",
		},
	];

	const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
	const unusedCount = subscriptions.filter((s) => s.status === "unused").length;

	return (
		<div className="min-h-screen p-6 space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<h1 className="text-slate-800 dark:text-slate-100">Subscriptions</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Manage your recurring payments
				</p>
			</div>

			{/* Summary Card */}
			<FinAICard className="bg-gradient-to-br from-teal-500 to-blue-500 text-white">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<p className="text-white/80">Total Monthly Cost</p>
						<p className="text-3xl">${totalMonthly.toFixed(2)}</p>
					</div>
					<div className="text-right">
						<p className="text-white/80">{subscriptions.length} active</p>
						<p className="text-2xl">{unusedCount}</p>
						<p className="text-white/80">unused</p>
					</div>
				</div>
			</FinAICard>

			{/* AI Suggestion */}
			<FinAICard className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
				<div className="flex items-start gap-3">
					<div className="bg-amber-400 p-2 rounded-full mt-1">
						<AlertCircle className="w-5 h-5 text-white" />
					</div>
					<div className="flex-1 space-y-2">
						<p className="text-slate-900 dark:text-slate-100">AI Suggests</p>
						<p className="text-slate-600 dark:text-slate-400">
							Cancel HBO Max and Nintendo Switch to save $34.98/month. You have
							not used them in over 45 days.
						</p>
						<Button
							size="sm"
							className="bg-amber-500 hover:bg-amber-600 text-white"
						>
							Review Suggestions
						</Button>
					</div>
				</div>
			</FinAICard>

			{/* Subscriptions List */}
			<div className="space-y-3">
				<h3 className="text-slate-800 dark:text-slate-100">
					All Subscriptions
				</h3>
				{subscriptions.map((sub, index) => (
					<FinAICard key={index} className="bg-white dark:bg-slate-800">
						<div className="flex items-center gap-4">
							<div
								className={`${sub.color} w-12 h-12 rounded-xl flex items-center justify-center`}
							>
								<sub.icon className="w-6 h-6 text-white" />
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<p className="text-slate-900 dark:text-slate-100">
										{sub.name}
									</p>
									{sub.status === "unused" && (
										<Badge variant="destructive" className="text-xs">
											Unused
										</Badge>
									)}
								</div>
								<p className="text-slate-500 dark:text-slate-400">
									Last used: {sub.lastUsed}
								</p>
							</div>
							<div className="text-right">
								<p className="text-slate-900 dark:text-slate-100">
									${sub.price}
								</p>
								<p className="text-slate-500 dark:text-slate-400">/month</p>
							</div>
						</div>
					</FinAICard>
				))}
			</div>
		</div>
	);
}
