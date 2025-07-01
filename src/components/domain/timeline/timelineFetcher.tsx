"use client";

import { NewPost } from "@/app/posts/newPost";
import { PostCard } from "@/components/general/post/postCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTimeline } from "@/lib/api/post";
import type { Post as PostType } from "@/types/post";
import { useEffect, useState } from "react";

export const TimelineFetcher = () => {
	const DEFAULT_TAB = "default";
	const FOLLOW_TAB = "follow";

	const [defaultPosts, setDefaultPosts] = useState<PostType[]>([]);
	const [followPosts, setFollowPosts] = useState<PostType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const getFollowPosts = async () => {
		const result = await fetchTimeline(FOLLOW_TAB);
		if (result.success) {
			setFollowPosts(result.data);
			setError(null);
		} else {
			setError(result.error.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		const getTimeline = async () => {
			const result = await fetchTimeline();
			if (result.success) {
				setDefaultPosts(result.data);
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
			<Tabs
				defaultValue={DEFAULT_TAB}
				onValueChange={(value: string) => {
					if (value === FOLLOW_TAB && followPosts.length === 0) {
						getFollowPosts();
					}
				}}
			>
				<TabsList className="w-full">
					<TabsTrigger value={DEFAULT_TAB} className="w-1/2">
						おすすめ
					</TabsTrigger>
					<TabsTrigger value={FOLLOW_TAB} className="w-1/2">
						フォロー中
					</TabsTrigger>
				</TabsList>
				<TabsContent value={DEFAULT_TAB}>
					<NewPost />
					{defaultPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</TabsContent>
				<TabsContent value={FOLLOW_TAB}>
					<NewPost />
					{followPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</TabsContent>
			</Tabs>
		</>
	);
};
