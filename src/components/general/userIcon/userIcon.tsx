import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { SquareArrowOutUpRight, UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type UserIconInfo = {
	id: number;
	image: string;
	isFollowing: boolean;
};

export const UserIcon = ({ iconInfo }: { iconInfo: UserIconInfo }) => {
	const [isFollowing, setIsFollowing] = useState(iconInfo.isFollowing);
	const handleFollow = async () => {
		const res = await fetch("/api/follow", {
			method: "POST",
			body: JSON.stringify({ user_id: iconInfo.id }),
		});
		setIsFollowing(res.ok);
		if (res.ok) return;

		alert("フォローに失敗しました");
	};

	if (iconInfo.isFollowing) {
		return (
			<Link href={`/users/${iconInfo.id}`}>
				<Avatar className="top-2 border-1 border-gray-300">
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
				{isFollowing ? (
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
					<Link href={`/users/${iconInfo.id}`}>
						<span>プロフィールページ</span>
						<SquareArrowOutUpRight />
					</Link>
				</Button>
			</PopoverContent>
		</Popover>
	);
};
