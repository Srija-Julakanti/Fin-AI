import FinAICard from "./shared/FinAICard";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Users, Target } from "lucide-react-native";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface FamilyFinanceProps {
	onBack?: () => void;
}

export default function FamilyFinance({ onBack }: FamilyFinanceProps) {
	const familyMembers = [
		{
			name: "Alex",
			spending: 2340,
			budget: 3000,
			color: "#14b8a6",
			initials: "A",
		},
		{
			name: "Jordan",
			spending: 1820,
			budget: 2500,
			color: "#3b82f6",
			initials: "J",
		},
		{
			name: "Sam",
			spending: 450,
			budget: 500,
			color: "#a855f7",
			initials: "S",
		},
		{
			name: "Riley",
			spending: 280,
			budget: 300,
			color: "#ec4899",
			initials: "R",
		},
	];

	const totalSpending = familyMembers.reduce(
		(sum, member) => sum + member.spending,
		0
	);
	const totalBudget = familyMembers.reduce(
		(sum, member) => sum + member.budget,
		0
	);

	const pieData = familyMembers.map((member) => ({
		name: member.name,
		value: member.spending,
		color: member.color,
	}));

	const goals = [
		{
			name: "Family Vacation",
			current: 3200,
			target: 5000,
			color: "bg-teal-500",
		},
		{
			name: "Emergency Fund",
			current: 8500,
			target: 10000,
			color: "bg-blue-500",
		},
		{
			name: "Home Renovation",
			current: 12000,
			target: 25000,
			color: "bg-purple-500",
		},
	];

	return (
		<div className="min-h-screen p-6 space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<h1 className="text-slate-800 dark:text-slate-100">Family Finance</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Combined family insights
				</p>
			</div>

			{/* Total Family Spending */}
			<FinAICard className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<p className="text-white/80">Total Family Spending</p>
						<p className="text-4xl">${totalSpending.toLocaleString()}</p>
						<p className="text-white/80">
							of ${totalBudget.toLocaleString()} budget
						</p>
					</div>
					<Users className="w-16 h-16 text-white/30" />
				</div>
			</FinAICard>

			{/* Spending by Member */}
			<div className="space-y-3">
				<h3 className="text-slate-800 dark:text-slate-100">
					Spending by Member
				</h3>
				<FinAICard className="bg-white dark:bg-slate-800">
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={pieData}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={80}
								paddingAngle={2}
								dataKey="value"
							>
								{pieData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>

					<div className="space-y-2 mt-4">
						{familyMembers.map((member, index) => (
							<div key={index} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Avatar
										className="w-8 h-8"
										style={{ backgroundColor: member.color }}
									>
										<AvatarFallback className="text-white">
											{member.initials}
										</AvatarFallback>
									</Avatar>
									<p className="text-slate-900 dark:text-slate-100">
										{member.name}
									</p>
								</div>
								<div className="text-right">
									<p className="text-slate-900 dark:text-slate-100">
										${member.spending.toLocaleString()}
									</p>
									<p className="text-slate-500 dark:text-slate-400">
										of ${member.budget.toLocaleString()}
									</p>
								</div>
							</div>
						))}
					</div>
				</FinAICard>
			</div>

			{/* Individual Progress */}
			<div className="space-y-3">
				<h3 className="text-slate-800 dark:text-slate-100">Budget Progress</h3>
				{familyMembers.map((member, index) => (
					<FinAICard key={index} className="bg-white dark:bg-slate-800">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Avatar
										className="w-10 h-10"
										style={{ backgroundColor: member.color }}
									>
										<AvatarFallback className="text-white">
											{member.initials}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-slate-900 dark:text-slate-100">
											{member.name}
										</p>
										<p className="text-slate-600 dark:text-slate-400">
											${member.spending} / ${member.budget}
										</p>
									</div>
								</div>
								<p className="text-slate-900 dark:text-slate-100">
									{Math.round((member.spending / member.budget) * 100)}%
								</p>
							</div>
							<Progress
								value={(member.spending / member.budget) * 100}
								className="h-2"
								style={{
									backgroundColor: `${member.color}20`,
								}}
							/>
						</div>
					</FinAICard>
				))}
			</div>

			{/* Family Goals */}
			<div className="space-y-3">
				<h3 className="text-slate-800 dark:text-slate-100">Family Goals</h3>
				{goals.map((goal, index) => (
					<FinAICard key={index} className="bg-white dark:bg-slate-800">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div
									className={`${goal.color} w-10 h-10 rounded-xl flex items-center justify-center`}
								>
									<Target className="w-5 h-5 text-white" />
								</div>
								<div className="flex-1">
									<p className="text-slate-900 dark:text-slate-100">
										{goal.name}
									</p>
									<p className="text-slate-600 dark:text-slate-400">
										${goal.current.toLocaleString()} of $
										{goal.target.toLocaleString()}
									</p>
								</div>
								<p className="text-slate-900 dark:text-slate-100">
									{Math.round((goal.current / goal.target) * 100)}%
								</p>
							</div>
							<Progress
								value={(goal.current / goal.target) * 100}
								className="h-2"
							/>
						</div>
					</FinAICard>
				))}
			</div>
		</div>
	);
}
