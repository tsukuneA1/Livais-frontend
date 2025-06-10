"use client";

import { Button } from "@/components/ui/button";
import { likePost } from "@/lib/api/post";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { LIKE_ARIA_LABEL } from "./constants";

type LikeButtonProps = {
	initialLiked: boolean;
	initialLikesCount: number;
	postId: number;
	userId: number | undefined;
};

export const LikeButton = ({
	initialLiked,
	initialLikesCount,
	postId,
	userId,
}: LikeButtonProps) => {
	const [liked, setLiked] = useState(initialLiked);
	const [likes, setLikes] = useState(initialLikesCount);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleLike = async () => {
		setLiked(!liked);
		setLikes((prev) => (liked ? prev - 1 : prev + 1));

		setIsAnimating(true);
		setTimeout(() => setIsAnimating(false), 500);
		await likePost({ postId: postId, userId: userId });
	};

	return (
		<Button
			variant="ghost"
			className="gap-1 rounded-full group"
			onClick={handleLike}
			aria-label={LIKE_ARIA_LABEL}
		>
			<Heart
				className={cn(
					"transition-all duration-300",
					liked ? "fill-red-500 text-red-500" : "fill-transparent",
					isAnimating && "scale-125 animate-pulse",
				)}
			/>
			<span className={cn(liked && "text-red-500")}>{likes}</span>
		</Button>
	);
};
