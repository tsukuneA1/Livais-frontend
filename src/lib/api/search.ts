import { Post } from "@/types/post";
import { Err, Ok, Result } from "@/types/result";
import { User } from "@/types/user";

export const searchPosts = async (query: string): Promise<Result<Post[]>> => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/search?q=${encodeURIComponent(query)}&f=live`,
		{
			cache: "no-store",
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
			credentials: "include",
		},
	);

	if (!res.ok) {
		return Err(new Error(`Failed to search posts: ${res.statusText}`));
	}

	const data = await res.json();
	return Ok(data as Post[]);
};

export const searchUsers = async (query: string): Promise<Result<User[]>> => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/search?q=${encodeURIComponent(query)}&f=users`,
		{
			cache: "no-store",
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
			credentials: "include",
		},
	);

	if (!res.ok) {
		return Err(new Error(`Failed to search users: ${res.statusText}`));
	}

	const data = await res.json();
	return Ok(data);
};
