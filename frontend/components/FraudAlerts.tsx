import { Button } from "./ui/button";
import FinAICard from "./shared/FinAICard";
import { Badge } from "./ui/badge";
import {
	AlertTriangle,
	CheckCircle,
	XCircle,
	MapPin,
	Clock,
} from "lucide-react-native";

interface FraudAlertsProps {
	onBack?: () => void;
}

export default function FraudAlerts({ onBack }: FraudAlertsProps) {
	const alerts = [
		{
			type: "suspicious",
			merchant: "Unknown Retailer - Dubai",
			amount: 247.89,
			time: "2 hours ago",
			status: "pending",
			location: "Dubai, UAE",
			description: "Unusual location detected",
		},
		{
			type: "suspicious",
			merchant: "Gas Station - Tokyo",
			amount: 89.5,
			time: "5 hours ago",
			status: "pending",
			location: "Tokyo, Japan",
			description: "Multiple rapid transactions",
		},
		{
			type: "verified",
			merchant: "Amazon.com",
			amount: 124.99,
			time: "Yesterday",
			status: "verified",
			location: "Seattle, WA",
			description: "You confirmed this transaction",
		},
		{
			type: "declined",
			merchant: "Suspicious Online Store",
			amount: 599.99,
			time: "2 days ago",
			status: "blocked",
			location: "Unknown",
			description: "Automatically blocked",
		},
	];

	const pendingCount = alerts.filter((a) => a.status === "pending").length;

	return (
		<div className="min-h-screen p-6 space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<h1 className="text-slate-800 dark:text-slate-100">Fraud Alerts</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Real-time security monitoring
				</p>
			</div>

			{/* Alert Summary */}
			{pendingCount > 0 && (
				<FinAICard className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
					<div className="flex items-center gap-3">
						<div className="bg-white/20 p-3 rounded-full">
							<AlertTriangle className="w-6 h-6" />
						</div>
						<div className="flex-1">
							<p className="text-xl">Action Required</p>
							<p className="text-white/90">
								{pendingCount} suspicious{" "}
								{pendingCount === 1 ? "transaction" : "transactions"} need your
								review
							</p>
						</div>
					</div>
				</FinAICard>
			)}

			{/* Alerts List */}
			<div className="space-y-3">
				<h3 className="text-slate-800 dark:text-slate-100">Recent Activity</h3>
				{alerts.map((alert, index) => (
					<FinAICard
						key={index}
						className={`bg-white dark:bg-slate-800 ${
							alert.status === "pending"
								? "border-2 border-orange-300 dark:border-orange-700"
								: ""
						}`}
					>
						<div className="space-y-3">
							{/* Header */}
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<p className="text-slate-900 dark:text-slate-100">
											{alert.merchant}
										</p>
										{alert.status === "pending" && (
											<Badge variant="destructive" className="text-xs">
												<AlertTriangle className="w-3 h-3 mr-1" />
												Review
											</Badge>
										)}
										{alert.status === "verified" && (
											<Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
												<CheckCircle className="w-3 h-3 mr-1" />
												Verified
											</Badge>
										)}
										{alert.status === "blocked" && (
											<Badge
												variant="outline"
												className="text-xs dark:border-slate-600"
											>
												<XCircle className="w-3 h-3 mr-1" />
												Blocked
											</Badge>
										)}
									</div>
									<p className="text-slate-600 dark:text-slate-400">
										{alert.description}
									</p>
								</div>
								<p className="text-slate-900 dark:text-slate-100 text-xl">
									${alert.amount}
								</p>
							</div>

							{/* Details */}
							<div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
								<div className="flex items-center gap-1">
									<MapPin className="w-4 h-4" />
									<span>{alert.location}</span>
								</div>
								<div className="flex items-center gap-1">
									<Clock className="w-4 h-4" />
									<span>{alert.time}</span>
								</div>
							</div>

							{/* Actions */}
							{alert.status === "pending" && (
								<div className="flex gap-2 pt-2">
									<Button
										size="sm"
										className="flex-1 bg-green-600 hover:bg-green-700"
									>
										<CheckCircle className="w-4 h-4 mr-1" />
										This was me
									</Button>
									<Button size="sm" variant="destructive" className="flex-1">
										<XCircle className="w-4 h-4 mr-1" />
										Report fraud
									</Button>
								</div>
							)}
						</div>
					</FinAICard>
				))}
			</div>

			{/* Security Info */}
			<FinAICard className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border-2 border-blue-200 dark:border-blue-800">
				<div className="space-y-2">
					<p className="text-slate-900 dark:text-slate-100">Protected by AI</p>
					<p className="text-slate-600 dark:text-slate-400">
						We monitor your accounts 24/7 using advanced machine learning to
						detect suspicious activity in real-time.
					</p>
				</div>
			</FinAICard>
		</div>
	);
}
