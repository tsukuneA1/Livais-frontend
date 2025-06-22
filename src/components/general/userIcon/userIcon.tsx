"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { pagesPath } from "@/lib/$path";
import { SquareArrowOutUpRight, UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type UserIconInfo = {
	id: number;
	image: string;
	canDirectAccess?: boolean;
};

export const UserIcon = ({ iconInfo }: { iconInfo: UserIconInfo }) => {
	const [canDirectAccess, setCanDirectAccess] = useState(
		iconInfo.canDirectAccess ?? true,
	);
	const handleFollow = async () => {
		const res = await fetch("/api/follow", {
			method: "POST",
			body: JSON.stringify({ user_id: iconInfo.id }),
		});
		setCanDirectAccess(res.ok);
		if (res.ok) return;

		alert("フォローに失敗しました");
	};

	const userPageLink = pagesPath.users._id(iconInfo.id).$url().path;

	if (iconInfo.canDirectAccess) {
		return (
			<Link href={userPageLink} className="inline-block">
				<Avatar className="top-0.5 border-1 border-gray-300">
					<AvatarImage src={iconInfo.image} />
					<AvatarFallback>U</AvatarFallback>
				</Avatar>
			</Link>
		);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="top-2 rounded-full">
					<Avatar className="border border-gray-300">
						<AvatarImage src={iconInfo.image} />
						<AvatarFallback>U</AvatarFallback>
					</Avatar>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="m-0 flex flex-col divide-y p-0">
				{canDirectAccess ? (
					<Button
						variant="ghost"
						size="sm"
						className="flex justify-between"
						onClick={handleFollow}
					>
						<span>フォローをやめる</span>
						<UserMinus />
					</Button>
				) : (
					<Button
						variant="ghost"
						size="sm"
						className="flex justify-between"
						onClick={handleFollow}
					>
						<span>フォロー</span>
						<UserPlus />
					</Button>
				)}
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="flex justify-between"
				>
					<Link href={userPageLink}>
						<span>プロフィールページ</span>
						<SquareArrowOutUpRight />
					</Link>
				</Button>
			</PopoverContent>
		</Popover>
	);
};
