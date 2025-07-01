"use client";

import { NewPost } from "@/app/posts/newPost";
import { PostCard } from "@/components/general/post/postCard";
import { fetchTimeline } from "@/lib/api/post";
import type { Post as PostType } from "@/types/post";
import { useEffect, useState } from "react";

export const TimelineFetcher = () => {
	const [posts, setPosts] = useState<PostType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getTimeline = async () => {
			const result = await fetchTimeline();
			if (result.success) {
				setPosts(result.data);
				setError(null);
			} else {
				setError(result.error.message);
			}
			setLoading(false);
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
};
