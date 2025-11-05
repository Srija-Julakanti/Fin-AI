import React, { createContext, useContext, useState } from "react";

type User = {
	id: string;
	name: string;
	email: string;
};

type AuthContextType = {
	user: User | null;
	token: string | null;
	login: (user: User, token?: string) => void;
	register: (user: User, token?: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
	user: null,
	token: null,
	login: () => {},
	register: () => {},
	logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);

	const login = (user: User, token?: string) => {
		setUser(user);
		if (token) setToken(token);
	};

	const register = (user: User, token?: string) => {
		// same as login — once you register, user is "logged in"
		setUser(user);
		if (token) setToken(token);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
