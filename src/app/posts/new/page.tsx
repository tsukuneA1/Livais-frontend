"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SubLayout } from "@/layouts/sub/layout";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
	Camera,
	CircleEllipsis,
	Copy,
	FileQuestion,
	GiftIcon,
	Images,
	MapPin,
	Mic,
	X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useUser } from "@/app/context/user-context";
import {
	visibilityOptions,
	visibilityTextMap,
} from "@/constants/visibilityOptions";
import { pagesPath } from "@/lib/$path";
import { createPost } from "@/lib/api/post";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PostFormPage = () => {
	const [content, setContent] = useState("");
	const [visibilityOption, setVisibilityOption] = useState(
		visibilityOptions[0],
	);
	const { user } = useUser();

	const router = useRouter();

	const handleSubmit = async () => {
		const postData = async () => {
			await createPost(content);
		};

		toast.promise(postData(), {
			loading: "投稿中...",
			success: () => {
				setContent("");
				setTimeout(() => {
					router.push(pagesPath.$url().pathname);
				}, 1000);
				return "投稿しました！";
			},
			error: "投稿に失敗しました...",
		});
	};

	return (
		<SubLayout>
			<div className="flex min-h-screen flex-col">
				<div className="flex items-center justify-between border-b px-4 py-4">
					<div className="flex items-center gap-3">
						<Link href={pagesPath.$url()}>
							<X />
						</Link>
						<h2 className="font-bold text-lg">新規スレッド</h2>
					</div>
					<div className="flex items-center gap-3">
						<Copy />
						<CircleEllipsis />
					</div>
				</div>

				<div className="mx-auto flex w-full max-w-xl flex-1 flex-col p-4">
					<div className="flex items-start gap-4">
						<Avatar>
							<AvatarImage src={user?.image} />
							<AvatarFallback>{"Ro"}</AvatarFallback>
						</Avatar>
						<div className="w-full">
							<div className="font-semibold text-zinc-800 dark:text-zinc-100">
								{"Rodney Ruecker"}
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
								<Camera className="text-zinc-400" />
								<GiftIcon className="text-zinc-400" />
								<Mic className="text-zinc-400" />
								<FileQuestion className="text-zinc-400" />
								<MapPin className="text-zinc-400" />
							</div>
						</div>
					</div>

					<div className="mt-auto flex items-center justify-between rounded-lg p-4 text-sm text-zinc-600">
						<Select
							defaultValue={visibilityOptions[0]}
							onValueChange={setVisibilityOption}
						>
							<SelectTrigger className="w-auto border-none shadow-none">
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
							onClick={handleSubmit}
							className="rounded-3xl"
							disabled={!content}
						>
							投稿
						</Button>
					</div>
				</div>
			</div>
		</SubLayout>
	);
};

export default PostFormPage;
