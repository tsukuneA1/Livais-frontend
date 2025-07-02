"use client";

import { NewPost } from "@/app/posts/newPost";
import { PostCard } from "@/components/general/post/postCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTimeline, tabType } from "@/lib/api/post";
import type { Post as PostType } from "@/types/post";
import { useEffect, useState } from "react";

export const TimelineFetcher = () => {
	const [defaultPosts, setDefaultPosts] = useState<PostType[]>([]);
	const [followPosts, setFollowPosts] = useState<PostType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const getFollowPosts = async () => {
		const result = await fetchTimeline(tabType.follow);
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
				defaultValue={tabType.default}
				onValueChange={(value: string) => {
					if (value === tabType.follow && followPosts.length === 0) {
						getFollowPosts();
					}
				}}
				className="mt-10"
			>
				<TabsList className="w-full grid grid-cols-2">
					<TabsTrigger value={tabType.default}>おすすめ</TabsTrigger>
					<TabsTrigger value={tabType.follow}>フォロー中</TabsTrigger>
				</TabsList>
				<TabsContent value={tabType.default}>
					<NewPost />
					{defaultPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</TabsContent>
				<TabsContent value={tabType.follow}>
					<NewPost />
					{followPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</TabsContent>
			</Tabs>
		</>
	);
};
