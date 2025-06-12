import type { PostDetail } from "@/types/post_detail";
import { Reply } from "./reply";

export const ReplyPostCard = ({ reply }: { reply: PostDetail }) => {
	return (
		<>
			<Reply reply={reply} />

			{reply.replies && reply.replies.length > 0 && (
				<ReplyPostCard reply={reply.replies[0]} />
			)}
		</>
	);
};
