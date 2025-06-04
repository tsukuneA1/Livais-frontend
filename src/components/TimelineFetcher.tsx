"use client";

import { NewPost } from "@/app/posts/newPost";
import { PostCard } from "@/components/postCard";
import { fetchTimeline } from "@/lib/api/post";
import type { Post } from "@/types/post";
import { useEffect, useState } from "react";

export function TimelineFetcher() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getTimeline = async () => {
			try {
				const fetchedPosts = await fetchTimeline();
				setPosts(fetchedPosts);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Failed to fetch posts: An unknown error occurred.");
				}
			} finally {
				setLoading(false);
			}
		};

		getTimeline();
	}, []);

	if (loading) {
		return <div>Loading posts...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<NewPost />
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</>
	);
}
