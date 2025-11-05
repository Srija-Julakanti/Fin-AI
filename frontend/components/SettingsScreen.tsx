import FinAICard from "./shared/FinAICard";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import {
	ChevronRight,
	User,
	Bell,
	Shield,
	CreditCard,
	Users,
	HelpCircle,
	LogOut,
	Moon,
	Sun,
	Monitor,
} from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

interface SettingsScreenProps {
	onNavigate?: (screen: string) => void;
}

type SettingsItem = {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	badge?: string;
	hasArrow?: boolean;
	hasSwitch?: boolean;
	enabled?: boolean;
	hasTheme?: boolean;
};

type SettingsSection = {
	title: string;
	items: SettingsItem[];
};

export default function SettingsScreen({ onNavigate }: SettingsScreenProps) {
	const { theme, setTheme } = useTheme();

	const getThemeIcon = (themeValue: string) => {
		switch (themeValue) {
			case "light":
				return Sun;
			case "dark":
				return Moon;
			case "system":
				return Monitor;
			default:
				return Monitor;
		}
	};

	const ThemeIcon = getThemeIcon(theme);

	const settingsSections: SettingsSection[] = [
		{
			title: "Account",
			items: [
				{ icon: User, label: "Profile Information", hasArrow: true },
				{
					icon: CreditCard,
					label: "Linked Accounts",
					badge: "3",
					hasArrow: true,
				},
				{ icon: Users, label: "Family Members", badge: "4", hasArrow: true },
			],
		},
		{
			title: "Preferences",
			items: [
				{ icon: Bell, label: "Notifications", hasSwitch: true, enabled: true },
				{
					icon: Shield,
					label: "Biometric Login",
					hasSwitch: true,
					enabled: true,
				},
				{ icon: getThemeIcon(theme), label: "Theme", hasTheme: true },
			],
		},
		{
			title: "Security",
			items: [
				{ icon: Shield, label: "Security Settings", hasArrow: true },
				{ icon: Shield, label: "Privacy Policy", hasArrow: true },
			],
		},
		{
			title: "Support",
			items: [
				{ icon: HelpCircle, label: "Help Center", hasArrow: true },
				{ icon: HelpCircle, label: "Contact Support", hasArrow: true },
			],
		},
	];

	return (
		<div className="min-h-screen p-6 space-y-6">
			{/* Header */}
			<div className="space-y-1">
				<h1 className="text-slate-800 dark:text-slate-100">Settings</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Manage your account
				</p>
			</div>

			{/* Profile Card */}
			<FinAICard className="bg-gradient-to-br from-teal-500 to-blue-500 text-white">
				<div className="flex items-center gap-4">
					<Avatar className="w-16 h-16 bg-white/20">
						<AvatarFallback className="text-white text-xl">A</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<p className="text-xl">Alex Morgan</p>
						<p className="text-white/80">alex.morgan@email.com</p>
					</div>
					<ChevronRight className="w-6 h-6 text-white/60" />
				</div>
			</FinAICard>

			{/* Settings Sections */}
			{settingsSections.map((section, sectionIndex) => (
				<div key={sectionIndex} className="space-y-3">
					<h3 className="text-slate-800 dark:text-slate-100">
						{section.title}
					</h3>
					<FinAICard className="bg-white dark:bg-slate-800">
						<div className="space-y-4">
							{section.items.map((item, itemIndex) => (
								<div key={itemIndex}>
									<div className="flex items-center gap-4">
										<div className="bg-slate-100 dark:bg-slate-700 w-10 h-10 rounded-xl flex items-center justify-center">
											<item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
										</div>
										<div className="flex-1">
											<p className="text-slate-900 dark:text-slate-100">
												{item.label}
											</p>
										</div>
										{item.badge && (
											<span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-1 rounded-full text-sm">
												{item.badge}
											</span>
										)}
										{item.hasSwitch && <Switch defaultChecked={item.enabled} />}
										{item.hasTheme && (
											<Select value={theme} onValueChange={setTheme}>
												<SelectTrigger className="w-32 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="dark:bg-slate-700 dark:border-slate-600">
													<SelectItem value="light">Light</SelectItem>
													<SelectItem value="dark">Dark</SelectItem>
													<SelectItem value="system">System</SelectItem>
												</SelectContent>
											</Select>
										)}
										{item.hasArrow && (
											<ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
										)}
									</div>
									{itemIndex < section.items.length - 1 && (
										<div className="border-b border-slate-100 dark:border-slate-700 mt-4" />
									)}
								</div>
							))}
						</div>
					</FinAICard>
				</div>
			))}

			{/* Encryption Notice */}
			<FinAICard className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
				<div className="flex items-start gap-3">
					<div className="bg-blue-500 p-2 rounded-full mt-1">
						<Shield className="w-5 h-5 text-white" />
					</div>
					<div className="flex-1">
						<p className="text-slate-900 dark:text-slate-100">
							Bank-Level Security
						</p>
						<p className="text-slate-600 dark:text-slate-400 mt-1">
							All your financial data is encrypted with 256-bit encryption and
							never shared without your permission.
						</p>
					</div>
				</div>
			</FinAICard>

			{/* Sign Out */}
			<FinAICard className="bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-900 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
				<div className="flex items-center gap-4 text-red-600 dark:text-red-400">
					<LogOut className="w-5 h-5" />
					<p>Sign Out</p>
				</div>
			</FinAICard>

			{/* App Version */}
			<p className="text-center text-slate-400 dark:text-slate-500">
				Fin-AI v1.0.0
			</p>
		</div>
	);
}
