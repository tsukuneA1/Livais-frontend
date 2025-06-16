"use client";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { repost } from "@/lib/api/post";
import { cn } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import { Edit, Repeat2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { REPOST_ARIA_LABEL } from "./constants";

type RepostButtonProps = {
	initialReposted: boolean;
	initialRepostsCount: number;
	postId: number;
};

export const RepostButton = ({
	initialReposted,
	initialRepostsCount,
	postId,
}: RepostButtonProps) => {
	const [reposted, setReposted] = useState(initialReposted);
	const [reposts, setReposts] = useState(initialRepostsCount);
	const [isAnimating, setIsAnimating] = useState(false);
	const [popoverOpen, setPopoverOpen] = useState(false);

	const handleRepost = async () => {
		setReposted(!reposted);
		setReposts((prev) => (reposted ? prev - 1 : prev + 1));

		setIsAnimating(true);
		setTimeout(() => setIsAnimating(false), 500);
		await repost({ postId: postId });
	};

	return (
		<>
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						className="gap-1 rounded-full group"
						aria-label={REPOST_ARIA_LABEL}
					>
						<Repeat2
							className={cn(
								"transition-all duration-300 group-hover:text-green-500",
								reposted ? "text-green-500" : "fill-transparent",
								isAnimating && "scale-125 animate-pulse",
							)}
						/>
						<span
							className={cn(
								"group-hover:text-green-500",
								reposted && "text-green-500",
							)}
						>
							{reposts}
						</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto p-2 border-gray-700 bg-black"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-col">
						<PopoverClose asChild>
							<Button
								variant="ghost"
								onClick={handleRepost}
								className="justify-start gap-2 p-2 text-white hover:bg-gray-800"
							>
								{reposted ? (
									<>
										<Trash2 size={18} className="text-red-500" />
										<span>リポストを取り消す</span>
									</>
								) : (
									<>
										<Repeat2 size={18} />
										<span>リポスト</span>
									</>
								)}
							</Button>
						</PopoverClose>
						<PopoverClose asChild>
							<Link
								href={`/compose/post?quoteId=${postId}`}
								className="flex items-center justify-start gap-2 p-2 rounded-md text-white hover:bg-gray-800"
							>
								<Edit size={18} />
								<span>引用して投稿</span>
							</Link>
						</PopoverClose>
					</div>
				</PopoverContent>
			</Popover>
		</>
	);
};
