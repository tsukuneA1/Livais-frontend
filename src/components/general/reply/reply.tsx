"use client";

import { useUser } from "@/app/context/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { pagesPath } from "@/lib/$path";
import type { PostDetail } from "@/types/post_detail";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { LikeButton } from "../like/likeButton";
import { QuotedPostCard } from "../postCreationDialog/quotedPostCard";
import { RepostButton } from "../repost/repostButton";

export const Reply = ({ reply }: { reply: PostDetail }) => {
	const { user } = useUser();
	return (
		<Link href={pagesPath.posts._id(reply.id).$url().path}>
			<div className="flex">
				<div className="flex flex-col items-center">
					<Avatar>
						<AvatarImage src={reply.user.image} />
						<AvatarFallback>{reply.user.name[0].toUpperCase()}</AvatarFallback>
					</Avatar>

					{reply.repliesCount > 0 && (
						<span className="w-px flex-1 bg-zinc-300 dark:bg-zinc-700 my-2" />
					)}
				</div>

				<div className="flex-1">
					<div className="font-semibold">@{reply.user.name}</div>
					<p className="text-zinc-800 dark:text-zinc-100">{reply.content}</p>
					{reply.quotedPost && <QuotedPostCard {...reply.quotedPost} />}
					<div className="mt-3 flex gap-4 text-sm text-zinc-500">
						<LikeButton
							initialLiked={reply.isLiked}
							initialLikesCount={reply.likesCount}
							postId={reply.id}
							userId={user?.id}
						/>
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center gap-1 px-2"
						>
							<MessageCircle className="h-4 w-4" />
							{reply.repliesCount}
						</Button>
						<RepostButton
							initialReposted={reply.isReposted}
							initialRepostsCount={reply.repostsCount}
							postId={reply.id}
						/>
					</div>
				</div>
			</div>
		</Link>
	);
};
