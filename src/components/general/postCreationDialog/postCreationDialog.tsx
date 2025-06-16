"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useUser } from "@/app/context/user-context";
import {
	visibilityOptions,
	visibilityTextMap,
} from "@/constants/visibilityOptions";
import { fetchPostDetail, quotePost } from "@/lib/api/post";
import { Post } from "@/types/post";
import {
	CircleEllipsis,
	Copy,
	FileQuestion,
	GiftIcon,
	Images,
	MapPin,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QuotedPostCard } from "./quotedPostCard";

export const PostCreationDialog = () => {
	const [content, setContent] = useState("");
	const [quotedPost, setQuotedPost] = useState<Post | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [visibilityOption, setVisibilityOption] = useState(
		visibilityOptions[0],
	);

	const { user } = useUser();

	const router = useRouter();
	const searchParams = useSearchParams();
	const quoteId = searchParams.get("quoteId");

	useEffect(() => {
		if (quoteId) {
			setIsLoading(true);

			fetchPostDetail(quoteId)
				.then(setQuotedPost)
				.catch(console.error)
				.finally(() => setIsLoading(false));
		}
	}, [quoteId]);

	const handleClose = () => {
		setTimeout(() => {
			router.back();
		}, 1000);
	};

	const handleSubmit = () => {
		if (!quotedPost) {
			toast.error("引用する投稿が見つかりません。");
			return;
		}

		setIsSubmitting(true);
		toast.promise(
			quotePost({
				content,
				quotedPostId: quotedPost.id,
			}),
			{
				loading: "投稿中...",
				success: () => {
					setContent("");
					handleClose();
					router.refresh();
					return "投稿しました！";
				},
				error: "投稿に失敗しました...",
				finally: () => setIsSubmitting(false),
			},
		);
	};

	return (
		<Dialog open={true} onOpenChange={handleClose}>
			<DialogContent className="max-h-[80vh] overflow-y-auto p-0">
				<DialogHeader className="border-b py-4 px-6">
					<div className="grid grid-cols-3">
						<button
							className="flex items-center cursor-pointer border-none all-unset"
							type="submit"
							onClick={handleClose}
						>
							キャンセル
						</button>
						<div className="flex justify-center items-center">
							<DialogTitle>新規スレッド</DialogTitle>
						</div>
						<div className="flex items-center justify-end gap-3">
							<Copy />
							<CircleEllipsis />
						</div>
					</div>
				</DialogHeader>
				<div className="flex flex-col py-4 px-6 pt-0">
					<div className="mx-auto flex w-full max-w-xl flex-1 flex-col ">
						<div className="flex items-start gap-4">
							<Avatar>
								<AvatarImage src={user?.image} />
								<AvatarFallback>{user?.name[0].toUpperCase()}</AvatarFallback>
							</Avatar>
							<div className="w-full">
								<div className="font-semibold text-zinc-800 dark:text-zinc-100">
									{user?.name}
								</div>
								<textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									placeholder="今なにしてる？"
									className="w-full resize-none border-none text-lg outline-none"
								/>
								<div className="flex items-center gap-4">
									<Images className="text-zinc-400" />
									<GiftIcon className="text-zinc-400" />
									<FileQuestion className="text-zinc-400" />
									<MapPin className="text-zinc-400" />
								</div>
								{isLoading && (
									<div className="mt-2 text-sm text-zinc-500">
										引用する投稿を読み込み中...
									</div>
								)}
								{quotedPost && <QuotedPostCard {...quotedPost} />}
							</div>
						</div>

						<div className="mt-auto flex items-center justify-between rounded-lg p-4 text-sm text-zinc-600 pb-0 mb-0">
							<Select
								defaultValue={visibilityOptions[0]}
								onValueChange={setVisibilityOption}
							>
								<SelectTrigger className="w-auto border-none shadow-none cursor-pointer">
									<SelectValue>
										<div className="flex items-center gap-2">
											{visibilityTextMap[visibilityOption] || ""}
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Status</SelectLabel>
										{visibilityOptions.map((option) => (
											<SelectItem key={option} value={option}>
												{option}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Button
								onClick={() => {
									handleSubmit();
								}}
								className="rounded-3xl"
								disabled={!content || isSubmitting}
							>
								投稿
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
