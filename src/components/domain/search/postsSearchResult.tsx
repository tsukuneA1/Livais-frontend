"use client";

import { PostCard } from "@/components/general/post/postCard";
import { searchPosts } from "@/lib/api/search";
import { Post } from "@/types/post";
import { useEffect, useState } from "react";

export const PostsSearchResult = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const query = new URLSearchParams(window.location.search).get("q") || "";

	useEffect(() => {
		const getSearchResult = async () => {
			try {
				const result = await searchPosts(query);
				if (result.success) {
					setPosts(result.data);
				} else {
					throw new Error(result.error.message || "Failed to fetch posts");
				}
			} finally {
				setLoading(false);
			}
		};

		getSearchResult();
	}, []);

	if (loading) {
		return <div>Loading posts...</div>;
	}

	return (
		<div className="space-y-4">
			{posts.length > 0 ? (
				posts.map((post) => <PostCard key={post.id} post={post} />)
			) : (
				<p className="py-8 text-center text-muted-foreground">
					関連する最新の投稿はありませんでした。
				</p>
			)}
		</div>
	);
};
