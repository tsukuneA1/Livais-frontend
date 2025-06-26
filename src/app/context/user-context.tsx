"use client";

import { fetchMe } from "@/lib/api/auth";
import type { User } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { pagesPath } from "@/lib/$path";

type UserContextType = {
	user: User | null;
	setUser: (user: User | null) => void;
	isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();
	const signinPath = pagesPath.signin.$url().pathname;
	const signupPath = pagesPath.signup.$url().pathname;

	useEffect(() => {
		const getUserData = async () => {
			if (pathname === signinPath || pathname === signupPath) {
				setIsLoading(false);
				return;
			}

			const token = localStorage.getItem("token");
			
			if (!token) {
				router.push(signinPath);
				setIsLoading(false);
				return;
			}

			const result = await fetchMe();
			
			if (result.success) {
				setUser(result.data);
			} else {
				localStorage.removeItem("token");
				router.push(signinPath);
			}
			
			setIsLoading(false);
		};

		getUserData();
	}, [pathname, router]);

	return (
		<UserContext.Provider value={{ user, setUser, isLoading }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) throw new Error("useUser must be used within UserProvider");
	return context;
};
