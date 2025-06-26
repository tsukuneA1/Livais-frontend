"use client";
import { fetchPostDetail } from "@/lib/api/post";
import type { PostDetail } from "@/types/post_detail";
import { useEffect, useState } from "react";
import { Reply } from "./reply";

export const RepliedPostCard = ({
	repliedPostId,
}: {
	repliedPostId: number;
}) => {
	const [parentPost, setParentPost] = useState<PostDetail | null>(null);

	useEffect(() => {
		const fetchParent = async () => {
			const result = await fetchPostDetail(repliedPostId.toString());
			if (result.success) {
				setParentPost(result.data);
			} else {
				console.error("Failed to fetch post details:", result.error.message);
				setParentPost(null);
			}
		};

		fetchParent();
	}, [repliedPostId]);

	return (
		<>
			{parentPost?.replyToId && (
				<RepliedPostCard repliedPostId={parentPost.replyToId} />
			)}

			{parentPost && <Reply reply={parentPost} />}
		</>
	);
};
