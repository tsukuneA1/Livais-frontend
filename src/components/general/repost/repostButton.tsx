"use client";

import { Button } from "@/components/ui/button";
import { repost } from "@/lib/api/post";
import { cn } from "@/lib/utils";
import { Repeat2 } from "lucide-react";
import { useState } from "react";
import { REPOST_ARIA_LABEL } from "./constants";

type Props = {
	initialReposted: boolean;
	initialRepostsCount: number;
	postId: number;
};

export const RepostButton = ({
	initialReposted,
	initialRepostsCount,
	postId,
}: Props) => {
	const [reposted, setReposted] = useState(initialReposted);
	const [reposts, setReposts] = useState(initialRepostsCount);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleRepost = async () => {
		setReposted(!reposted);
		setReposts((prev) => (reposted ? prev - 1 : prev + 1));

		setIsAnimating(true);
		setTimeout(() => setIsAnimating(false), 500);
		await repost({ postId: postId });
	};

	return (
		<Button
			variant="ghost"
			className="gap-1 rounded-full group"
			onClick={handleRepost}
			aria-label={REPOST_ARIA_LABEL}
		>
			<Repeat2
				className={cn(
					"transition-all duration-300",
					reposted ? "text-green-500" : "fill-transparent",
					isAnimating && "scale-125 animate-pulse",
				)}
			/>
			<span className={cn(reposted && "text-green-500")}>{reposts}</span>
		</Button>
	);
};
