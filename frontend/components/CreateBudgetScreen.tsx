import { useState } from "react";
import FinAICard from "./shared/FinAICard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Sparkles, DollarSign } from "lucide-react-native";

interface CreateBudgetScreenProps {
	onBack?: () => void;
	onSuccess?: () => void;
	onClose?: () => void;
}

export default function CreateBudgetScreen({
	onBack,
	onSuccess,
	onClose,
}: CreateBudgetScreenProps) {
	const [budgets, setBudgets] = useState({
		groceries: "",
		transportation: "",
		bills: "",
		subscriptions: "",
		dining: "",
		healthcare: "",
		other: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const categories = [
		{ id: "groceries", label: "Groceries", icon: "🛒", suggested: 600 },
		{
			id: "transportation",
			label: "Transportation",
			icon: "🚗",
			suggested: 300,
		},
		{ id: "bills", label: "Bills & Utilities", icon: "🏠", suggested: 800 },
		{ id: "subscriptions", label: "Subscriptions", icon: "📱", suggested: 150 },
		{ id: "dining", label: "Dining Out", icon: "☕", suggested: 200 },
		{ id: "healthcare", label: "Healthcare", icon: "❤️", suggested: 250 },
		{ id: "other", label: "Other", icon: "💰", suggested: 400 },
	];

	const totalBudget = Object.values(budgets).reduce(
		(sum, val) => sum + (parseFloat(val) || 0),
		0
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate saving
		setTimeout(() => {
			setIsSubmitting(false);
			onSuccess && onSuccess();
		}, 1000);
	};

	const applySuggested = () => {
		const suggested: any = {};
		categories.forEach((cat) => {
			suggested[cat.id] = cat.suggested.toString();
		});
		setBudgets(suggested);
	};

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
					<h1 className="text-slate-800 dark:text-slate-100">
						Create Monthly Budget
					</h1>
					<p className="text-slate-600 dark:text-slate-400">
						Set spending limits for each category
					</p>
				</div>
			</div>

			{/* AI Suggestion */}
			<FinAICard className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800">
				<div className="flex items-start gap-3">
					<div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full mt-1">
						<Sparkles className="w-5 h-5 text-white" />
					</div>
					<div className="flex-1 space-y-2">
						<p className="text-slate-900 dark:text-slate-100">
							AI Budget Suggestions
						</p>
						<p className="text-slate-600 dark:text-slate-400">
							Based on your income and spending patterns, we recommend a monthly
							budget of $
							{categories
								.reduce((sum, cat) => sum + cat.suggested, 0)
								.toLocaleString()}
							.
						</p>
						<Button
							size="sm"
							onClick={applySuggested}
							className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
						>
							Apply Suggested Budget
						</Button>
					</div>
				</div>
			</FinAICard>

			{/* Total Budget Preview */}
			<FinAICard className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
				<div className="text-center space-y-2">
					<p className="text-white/80">Total Monthly Budget</p>
					<p className="text-5xl">${totalBudget.toLocaleString()}</p>
				</div>
			</FinAICard>

			{/* Budget Form */}
			<form onSubmit={handleSubmit} className="space-y-4">
				<FinAICard className="bg-white dark:bg-slate-800">
					<div className="space-y-4">
						{categories.map((category) => (
							<div key={category.id} className="space-y-2">
								<Label
									htmlFor={category.id}
									className="dark:text-slate-200 flex items-center gap-2"
								>
									<span className="text-xl">{category.icon}</span>
									{category.label}
									<span className="text-sm text-slate-500 dark:text-slate-400 ml-auto">
										Suggested: ${category.suggested}
									</span>
								</Label>
								<div className="flex items-center gap-2">
									<DollarSign className="w-5 h-5 text-slate-400" />
									<Input
										id={category.id}
										type="number"
										step="0.01"
										placeholder="0.00"
										value={budgets[category.id as keyof typeof budgets]}
										onChange={(e) =>
											setBudgets({ ...budgets, [category.id]: e.target.value })
										}
										className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
									/>
								</div>
							</div>
						))}
					</div>
				</FinAICard>

				{/* Action Buttons */}
				<div className="grid grid-cols-2 gap-3">
					<Button
						type="button"
						variant="outline"
						className="h-12 dark:border-slate-600 dark:text-slate-300"
						onClick={onBack}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="h-12 bg-teal-600 hover:bg-teal-700"
						disabled={isSubmitting || totalBudget === 0}
					>
						{isSubmitting ? "Saving..." : "Create Budget"}
					</Button>
				</div>
			</form>
		</div>
	);
}
