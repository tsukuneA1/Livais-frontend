import type { Post } from "@/types/post";

export async function fetchTimeline(): Promise<Post[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts`, {
		cache: "no-store",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch timeline: ${res.statusText}`);
	}
	return await res.json();
}

export async function fetchPostDetail(postId: string): Promise<Post> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts/${postId}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
			cache: "no-store",
			credentials: "include",
		},
	);

	if (!res.ok) {
		throw new Error(`Failed to fetch post with id: ${postId}`);
	}

	return await res.json();
}

export async function createPost(content: string): Promise<void> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
		credentials: "include",
		body: JSON.stringify({
			content,
		}),
	});

	if (!res.ok) {
		throw new Error(`Failed to create post: ${res.statusText}`);
	}
}

export async function postReply({
	content,
	replyToId,
}: {
	content: string;
	replyToId: number;
}): Promise<void> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts/${replyToId}/replies`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
			credentials: "include",
			body: JSON.stringify({
				content,
				reply_to_id: replyToId,
			}),
		},
	);

	if (!res.ok) {
		throw new Error(`Failed to post reply: ${res.statusText}`);
	}
}

export async function likePost({
	postId,
	userId,
}: {
	postId: number;
	userId: number | undefined;
}): Promise<Post> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts/${postId}/likes`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
			credentials: "include",
			body: JSON.stringify({
				user_id: userId,
				post_id: postId,
			}),
		},
	);

	if (!res.ok) {
		throw new Error(`Failed to like post: ${res.statusText}`);
	}

	return await fetchPostDetail(postId.toString());
}

export async function repost({
	postId,
}: {
	postId: number;
}): Promise<Post> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts/${postId}/reposts`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
			credentials: "include",
			body: JSON.stringify({
				post_id: postId,
			}),
		},
	);

	if (!res.ok) {
		throw new Error(`Failed to repost: ${res.statusText}`);
	}

	return await fetchPostDetail(postId.toString());
}

export const quotePost = async ({
	quotedPostId,
	content,
}: {
	quotedPostId: number;
	content: string;
}): Promise<Post> => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
		},
		credentials: "include",
		body: JSON.stringify({
			content: content,
			quoted_post_id: quotedPostId,
		}),
	});

	if (!res.ok) {
		throw new Error(`Failed to quote post: ${res.statusText}`);
	}

	return await res.json();
};
