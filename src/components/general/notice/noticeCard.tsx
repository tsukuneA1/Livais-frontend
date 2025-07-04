"use client";
import { UserIcon } from "@/components/general/userIcon/userIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { pagesPath } from "@/lib/$path";
import { hideNotice } from "@/lib/api/notice";
import { getTimeDistance } from "@/lib/utils";
import { Notice, NotifiableType } from "@/types/notice";
import {
	Frown,
	Heart,
	MessageSquareOff,
	MoreHorizontal,
	Repeat2,
	UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const NoticeCard = ({ notice }: { notice: Notice }) => {
	const [isHidden, setIsHidden] = useState(false);
	const link = notice.post
		? pagesPath.posts._id(notice.post.id).$url().path
		: pagesPath.users._id(notice.user.id).$url().path;

	const handleHideNotice = async (id: number) => {
		const result = await hideNotice(id);
		if (result.success) {
			setIsHidden(true);
		} else {
			console.error("Failed to hide notice:", result.error.message);
		}
	};

	if (isHidden) return null;

	return (
		<Card className="w-full rounded-none p-4 sm:w-2xs md:w-2xl flex gap-4">
			<div className="pt-2">
				<NoticeIcon type={notice.notifiableType} />
			</div>
			<div className="flex flex-col flex-1">
				<div className="flex items-center p-0 pb-0.5 flex-1">
					<UserIcon iconInfo={{ ...notice.user }} />
					<span className="text-gray-400 text-xs ml-4 pt-3">
						{getTimeDistance(notice.createdAt)}
					</span>
					<Popover>
						<PopoverTrigger
							asChild
							className="ml-auto text-gray-500 hidden md:block"
						>
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="h-4 w-4 ml-2.5" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							align="end"
							className="m-0 flex flex-col divide-y p-0"
						>
							<NoticeOptions
								noticeId={notice.id}
								handleHideNotice={handleHideNotice}
							/>
						</PopoverContent>
					</Popover>
					<Drawer>
						<DrawerTrigger asChild className="ml-auto text-gray-500 md:hidden">
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="h-4 w-4 ml-2.5" />
							</Button>
						</DrawerTrigger>
						<DrawerContent className="flex flex-col bg-neutral-200 p-4">
							<DrawerTitle className="mt-3" />
							<NoticeOptions
								noticeId={notice.id}
								handleHideNotice={handleHideNotice}
							/>
						</DrawerContent>
					</Drawer>
				</div>
				<Link href={link} className="w-full h-full">
					<div>
						<span className="font-bold">{notice.user.name}</span>
						<span className="font-normal">
							{noticeMessages[notice.notifiableType]}
						</span>
					</div>
					<span className="mt-2 text-gray-500">
						{notice.post?.content ? notice.post.content : ""}
					</span>
				</Link>
			</div>
		</Card>
	);
};

const NoticeIcon = ({ type }: { type: NotifiableType }) => {
	switch (type) {
		case NotifiableType.Like:
			return <Heart className="text-red-400 fill-red-400" />;
		case NotifiableType.Repost:
			return <Repeat2 />;
		case NotifiableType.Reply:
			return <MessageSquareOff />;
		case NotifiableType.Follow:
			return <UserRoundPlus />;
		default:
			return null;
	}
};

const NoticeOptions = ({
	noticeId,
	handleHideNotice,
}: { noticeId: number; handleHideNotice: (id: number) => void }) => {
	return (
		<div className="m-1 flex flex-col divide-y rounded-md bg-white">
			<Button
				variant="ghost"
				className="flex justify-between"
				onClick={() => {
					handleHideNotice(noticeId);
				}}
			>
				<span>表示しない</span>
				<Frown />
			</Button>
		</div>
	);
};

const noticeMessages: Partial<Record<NotifiableType, string>> = {
	[NotifiableType.Like]: "さんがあなたの投稿にいいねしました",
	[NotifiableType.Repost]: "さんがあなたの投稿をリポストしました",
	[NotifiableType.Reply]: "さんがあなたの投稿に返信しました",
	[NotifiableType.Follow]: "さんがあなたをフォローしました",
	[NotifiableType.Quote]: "さんがあなたの投稿を引用しました",
};
