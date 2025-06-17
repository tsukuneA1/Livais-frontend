"use client";

import { useUser } from "@/app/context/user-context";
import { fetchPostDetail } from "@/lib/api/post";
import type { Post as PostType } from "@/types/post";
import { useEffect, useRef, useState } from "react";
import { RepliedPostCard } from "../reply/repliedPostCard";
import ReplyForm from "../reply/replyForm";
import { ReplyPostCard } from "../reply/replyPostCard";
import { Post } from "./post";

type Props = {
	id: string;
};

export const DetailPost = ({ id }: Props) => {
	const [post, setPost] = useState<PostType | null>(null);
	const mainPostRef = useRef<HTMLDivElement | null>(null);
	const { user } = useUser();

	useEffect(() => {
		const getPost = async () => {
			try {
				const fetchedPost = await fetchPostDetail(id);
				setPost(fetchedPost);
			} catch (error) {
				console.error("Failed to fetch post:", error);
			}
		};

		getPost();
	}, [id]);

	useEffect(() => {
		if (post && mainPostRef.current) {
			mainPostRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
		}
	}, [post]);

	if (!post) return <div>Loading...</div>;

	return (
		<div className="min-h-screen flex flex-col">
			{post.replyToId && <RepliedPostCard repliedPostId={post.replyToId} />}
			<div className="max-w-2xl flex-1">
				<div ref={mainPostRef} />
				<Post post={post} />
				{post.repliesCount > 0 && (
					<div className="mt-4">
						<div className="flex items-center gap-2 text-sm text-zinc-500 justify-between py-2 border-t">
							<h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
								返信
							</h3>
							<span className="text-zinc-400">アクティビティを表示</span>
						</div>
						{post.replies.map((reply) => (
							<div key={reply.id} className="border-t py-4">
								<ReplyPostCard reply={reply} />
							</div>
						))}
					</div>
				)}
			</div>

			<div className="sticky bottom-0 w-full bg-white dark:bg-black border-t p-4">
				<ReplyForm user={user} replyToPost={post} />
			</div>
		</div>
	);
};
