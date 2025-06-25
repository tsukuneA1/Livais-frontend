"use client";

import { UserCard } from "@/components/general/user/userCard";
import { searchUsers } from "@/lib/api/search";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export const UsersSearchResult = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const query = new URLSearchParams(window.location.search).get("q") || "";

	useEffect(() => {
		const getSearchResult = async () => {
			try {
				const result = await searchUsers(query);
				if (result.success) {
					setUsers(result.data);
				} else {
					throw new Error(result.error.message || "Failed to fetch users");
				}
			} finally {
				setLoading(false);
			}
		};

		getSearchResult();
	}, []);

	if (loading) {
		return <div>Loading users...</div>;
	}

	return (
		<div className="space-y-4">
			{users.length > 0 ? (
				users.map((user) => <UserCard key={user.id} user={user} />)
			) : (
				<p className="py-8 text-center text-muted-foreground">
					関連する最新のユーザーはありませんでした。
				</p>
			)}
		</div>
	);
};
