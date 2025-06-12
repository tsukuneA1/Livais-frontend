import { Button } from "@/components/ui/button";
import {
	Bookmark,
	EyeOff,
	Link2,
	MessageSquareOff,
	ShieldAlert,
	UserRoundX,
} from "lucide-react";

export const PostOptions = () => {
	return (
		<div>
			<div className="m-1 flex flex-col divide-y rounded-md bg-white">
				<Button variant="ghost" size="sm" className="flex justify-between">
					<span>保存</span>
					<Bookmark />
				</Button>
				<Button variant="ghost" size="sm" className="flex justify-between">
					<span>興味なし</span>
					<EyeOff />
				</Button>
			</div>
			<div className="m-1 flex flex-col divide-y rounded-md bg-white">
				<Button variant="ghost" size="sm" className="flex justify-between">
					<span>リンクをコピー</span>
					<Link2 />
				</Button>
			</div>
			<div className="m-1 flex flex-col divide-y rounded-md bg-white">
				<Button variant="ghost" size="sm" className="flex justify-between">
					<span>ミュート</span>
					<MessageSquareOff />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="flex justify-between text-red-500"
				>
					<span>ブロック</span>
					<UserRoundX />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="flex justify-between text-red-500"
				>
					<span>報告する</span>
					<ShieldAlert />
				</Button>
			</div>
		</div>
	);
};
