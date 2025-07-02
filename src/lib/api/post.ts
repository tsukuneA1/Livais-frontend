import {
	LikePostError,
	PostCreateError,
	PostFetchError,
	QuotePostError,
	ReplyPostError,
	RepostError,
	TimelineFetchError,
} from "@/types/api-errors";
import type { Post } from "@/types/post";
import { Err, Ok, Result } from "@/types/result";
import { apiClient } from "./api-client";

export type tabType = "default" | "follow";

export const fetchTimeline = async (
	tab: string = "default",
): Promise<Result<Post[]>> => {
	const result = await apiClient.get<Post[]>(`/api/v1/?tab=${tab}`);

	if (!result.success) {
		return Err(new TimelineFetchError(result.error.message));
	}

	return Ok(result.data);
};

export const fetchPostDetail = async (
	postId: string,
): Promise<Result<Post>> => {
	const result = await apiClient.get<Post>(`/api/v1/posts/${postId}`);

	if (!result.success) {
		return Err(new PostFetchError(result.error.message));
	}

	return Ok(result.data);
};

export const createPost = async (content: string): Promise<Result<void>> => {
	const result = await apiClient.post<void>("/api/v1/posts", { content });

	if (!result.success) {
		return Err(new PostCreateError(result.error.message));
	}

	return Ok(undefined);
};

export const postReply = async ({
	content,
	replyToId,
}: {
	content: string;
	replyToId: number;
}): Promise<Result<void>> => {
	const result = await apiClient.post<void>(
		`/api/v1/posts/${replyToId}/replies`,
		{
			content,
			reply_to_id: replyToId,
		},
	);

	if (!result.success) {
		return Err(new ReplyPostError(result.error.message));
	}

	return Ok(undefined);
};

export const likePost = async ({
	postId,
	userId,
}: {
	postId: number;
	userId: number | undefined;
}): Promise<Result<Post>> => {
	const result = await apiClient.post<void>(`/api/v1/posts/${postId}/likes`, {
		user_id: userId,
		post_id: postId,
	});

	if (!result.success) {
		return Err(new LikePostError(result.error.message));
	}

	const postResult = await fetchPostDetail(postId.toString());
	return postResult;
};

export const repost = async ({
	postId,
}: {
	postId: number;
}): Promise<Result<Post>> => {
	const result = await apiClient.post<void>(`/api/v1/posts/${postId}/reposts`, {
		post_id: postId,
	});

	if (!result.success) {
		return Err(new RepostError(result.error.message));
	}

	const postResult = await fetchPostDetail(postId.toString());
	return postResult;
};

export const quotePost = async ({
	quotedPostId,
	content,
}: {
	quotedPostId: number;
	content: string;
}): Promise<Result<Post>> => {
	const result = await apiClient.post<Post>("/api/v1/posts", {
		content: content,
		quoted_post_id: quotedPostId,
	});

	if (!result.success) {
		return Err(new QuotePostError(result.error.message));
	}

	return Ok(result.data);
};
