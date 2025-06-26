import { SearchPostsError, SearchUsersError } from "@/types/api-errors";
import { Post } from "@/types/post";
import { Err, Ok, Result } from "@/types/result";
import { User } from "@/types/user";
import { apiClient } from "./api-client";

export const searchPosts = async (query: string): Promise<Result<Post[]>> => {
	const result = await apiClient.get<Post[]>(
		`/api/v1/search?q=${encodeURIComponent(query)}&f=live`,
	);

	if (!result.success) {
		return Err(new SearchPostsError(result.error.message));
	}

	return Ok(result.data);
};

export const searchUsers = async (query: string): Promise<Result<User[]>> => {
	const result = await apiClient.get<User[]>(
		`/api/v1/search?q=${encodeURIComponent(query)}&f=users`,
	);

	if (!result.success) {
		return Err(new SearchUsersError(result.error.message));
	}

	return Ok(result.data);
};
