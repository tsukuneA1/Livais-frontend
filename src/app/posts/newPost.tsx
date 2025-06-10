"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { breakPoints } from "@/constants/breakpoints";
import { visibilityOptions } from "@/constants/visibilityOptions";
import { pagesPath } from "@/lib/$path";
import { createPost } from "@/lib/api/post";
import { useMediaQuery } from "@mui/material";
import {
	CircleEllipsis,
	Copy,
	FileQuestion,
	GiftIcon,
	Images,
	MapPin,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "../context/user-context";

export const NewPost = () => {
	const isDesktop = useMediaQuery(
		`( min-width: ${breakPoints.mobileToDesktop} )`,
	);

	const [content, setContent] = useState("");
	const [visibilityOption, setVisibilityOption] = useState(
		visibilityOptions[0],
	);
	const [dialogOpen, setDialogOpen] = useState(false);
	const { user } = useUser();

	const router = useRouter();

	const handleSubmit = async () => {
		const postData = async () => {
			await createPost(content, user?.id);
		};

		toast.promise(postData(), {
			loading: "投稿中...",
			success: () => {
				setContent("");
				setTimeout(() => {
					router.push("/");
				}, 1000);
				return "投稿しました！";
			},
			error: "投稿に失敗しました...",
		});
	};
	if (isDesktop) {
		return (
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogTrigger asChild className="cursor-pointer">
					<div className="mx-auto w-2xl space-y-6 border p-4 rounded-t-3xl">
						<div className="flex items-start gap-4 ">
							<Avatar>
								<AvatarImage src={user?.image} />
								<AvatarFallback>{user?.name[0].toUpperCase()}</AvatarFallback>
							</Avatar>
							<div>
								<div className="font-semibold text-zinc-800 dark:text-zinc-100">
									{user?.name}
								</div>

								<p className="mt-1 whitespace-pre-wrap text-base text-zinc-400 dark:text-zinc-200">
									今なにしてる？
								</p>
							</div>
						</div>
					</div>
				</DialogTrigger>
				<DialogContent className="max-h-[80vh] overflow-y-auto p-0">
					<DialogHeader className="border-b py-4 px-6">
						<div className="grid grid-cols-3">
							<button
								className="flex items-center cursor-pointer border-none all-unset"
								onClick={() => setDialogOpen(false)}
								type="submit"
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
									<AvatarFallback>{"Ro"}</AvatarFallback>
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
										rows={3}
									/>
									<div className="mt-4 flex items-center gap-4">
										<Images className="text-zinc-400" />
										<GiftIcon className="text-zinc-400" />
										<FileQuestion className="text-zinc-400" />
										<MapPin className="text-zinc-400" />
									</div>
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
												{visibilityOption === visibilityOptions[0] ? (
													<div>フォロワーは返信・引用できます</div>
												) : visibilityOption === visibilityOptions[1] ? (
													<div className="flex items-center gap-2">
														フォロー中のユーザーは返信・引用できます
													</div>
												) : (
													<div className="flex items-center gap-2">
														メンションしたユーザーのみは返信・引用できます
													</div>
												)}
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
										setDialogOpen(false);
									}}
									className="rounded-3xl"
									disabled={!content}
								>
									投稿
								</Button>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Link href={pagesPath.posts.new.$url()} className="cursor-pointer">
			<div className="mx-auto w-2xl space-y-6 border p-4 rounded-t-2xl">
				<div className="flex items-start gap-4 ">
					<Avatar>
						<AvatarImage src={user?.image} />
						<AvatarFallback>{user?.name[0].toUpperCase()}</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-semibold text-zinc-800 dark:text-zinc-100">
							{user?.name}
						</div>

						<p className="mt-1 whitespace-pre-wrap text-base text-zinc-400 dark:text-zinc-200">
							今なにしてる？
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};
