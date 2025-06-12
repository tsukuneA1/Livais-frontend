"use client";

import { fetchMe } from "@/lib/api/auth";
import type { User } from "@/types/users";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
	user: User | null;
	setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const getUserData = async () => {
			const userData = await fetchMe();
			setUser(userData);
		};

		getUserData();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) throw new Error("useUser must be used within UserProvider");
	return context;
};
