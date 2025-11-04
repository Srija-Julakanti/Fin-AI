import { useState } from "react";
import HomeDashboard from "../../components/HomeDashboard";
import ForecastScreen from "../../components/ForecastScreen";
import CreditCardOptimizer from "../../components/CreditCardOptimizer";
import BudgetManager from "../../components/BudgetManager";
import SettingsScreen from "../../components/SettingsScreen";
import LoginScreen from "../../components/LoginScreen";
import RegisterScreen from "../../components/RegisterScreen";
import OnboardingScreens from "../../components/OnboardingScreens";
import AddCardScreen from "../../components/AddCardScreen";
import AddExpenseScreen from "../../components/AddExpenseScreen";
import CreateBudgetScreen from "../../components/CreateBudgetScreen";
import FamilyFinance from "../../components/FamilyFinance";
import SubscriptionManager from "../../components/SubscriptionManager";
import FraudAlerts from "../../components/FraudAlerts";
import CategoryTransactions from "../../components/CategoryTransactions";
import BottomNav from "../../components/shared/BottomNav";

export default function App() {
	const [currentScreen, setCurrentScreen] = useState("login");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [onboardingComplete, setOnboardingComplete] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const handleLogin = () => {
		setIsAuthenticated(true);
		if (!onboardingComplete) {
			setCurrentScreen("onboarding");
		} else {
			setCurrentScreen("home");
		}
	};

	const handleRegister = () => {
		setIsAuthenticated(true);
		setCurrentScreen("onboarding");
	};

	const handleOnboardingComplete = () => {
		setOnboardingComplete(true);
		setCurrentScreen("home");
	};

	const handleCategorySelect = (category: string) => {
		setSelectedCategory(category);
		setCurrentScreen("categoryTransactions");
	};

	const navigateTo = (screen: string) => {
		setCurrentScreen(screen);
	};

	// Not authenticated - show auth screens
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600">
				{currentScreen === "login" && (
					<LoginScreen
						onLogin={handleLogin}
						onNavigateToRegister={() => setCurrentScreen("register")}
					/>
				)}
				{currentScreen === "register" && (
					<RegisterScreen
						onRegister={handleRegister}
						onLogin={() => setCurrentScreen("login")}
					/>
				)}
			</div>
		);
	}

	// Authenticated but onboarding not complete
	if (!onboardingComplete && currentScreen === "onboarding") {
		return <OnboardingScreens onComplete={handleOnboardingComplete} />;
	}

	// Main app screens
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
			{/* Main Content */}
			<div className="max-w-md mx-auto min-h-screen bg-white dark:bg-slate-900">
				{currentScreen === "home" && <HomeDashboard onNavigate={navigateTo} />}
				{currentScreen === "forecast" && <ForecastScreen />}
				{currentScreen === "cards" && (
					<CreditCardOptimizer onNavigate={navigateTo} />
				)}
				{currentScreen === "budget" && (
					<BudgetManager onNavigate={navigateTo} />
				)}
				{currentScreen === "settings" && (
					<SettingsScreen onNavigate={navigateTo} />
				)}

				{/* Modal Screens */}
				{currentScreen === "addCard" && (
					<AddCardScreen onClose={() => setCurrentScreen("cards")} />
				)}
				{currentScreen === "addExpense" && (
					<AddExpenseScreen onClose={() => setCurrentScreen("home")} />
				)}
				{currentScreen === "createBudget" && (
					<CreateBudgetScreen onClose={() => setCurrentScreen("budget")} />
				)}
				{currentScreen === "familyFinance" && (
					<FamilyFinance onBack={() => setCurrentScreen("home")} />
				)}
				{currentScreen === "subscriptions" && (
					<SubscriptionManager onBack={() => setCurrentScreen("home")} />
				)}
				{currentScreen === "fraudAlerts" && (
					<FraudAlerts onBack={() => setCurrentScreen("home")} />
				)}
				{currentScreen === "categoryTransactions" && selectedCategory && (
					<CategoryTransactions
						category={selectedCategory}
						onBack={() => setCurrentScreen("forecast")}
					/>
				)}
			</div>

			{/* Bottom Navigation */}
			{["home", "forecast", "cards", "budget", "settings"].includes(
				currentScreen
			) && (
				<BottomNav
					currentScreen={currentScreen}
					onNavigate={setCurrentScreen}
				/>
			)}
		</div>
	);
}
