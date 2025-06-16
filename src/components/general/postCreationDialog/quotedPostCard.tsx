import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { pagesPath } from "@/lib/$path";
import { getTimeDistance } from "@/lib/utils";
import { Post } from "@/types/post";
import { useRouter } from "next/navigation";

export const QuotedPostCard = (post: Post) => {
	const router = useRouter();

	const handleQuoteClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		router.push(pagesPath.posts._id(post.id).$url().path);
	};
	return (
		<div
			className="mt-2 p-3 border border-gray-400 rounded-xl"
			onClick={handleQuoteClick}
		>
			<div className="flex items-center gap-2 mb-2">
				<Avatar className="w-5 h-5">
					<AvatarImage src={post.user.image} />
					<AvatarFallback>{post.user.name[0]}</AvatarFallback>
				</Avatar>
				<span className="font-bold text-sm">{post.user.name}</span>
				<span className="text-gray-400 text-xs">
					{getTimeDistance(post.createdAt)}
				</span>
			</div>
			<p className="text-sm">{post.content}</p>
		</div>
	);
};
