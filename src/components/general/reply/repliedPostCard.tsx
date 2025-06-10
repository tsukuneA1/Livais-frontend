"use client";
import { fetchPostDetail } from "@/lib/api/post";
import type { PostDetail } from "@/types/post_detail";
import { useEffect, useState } from "react";
import { Reply } from "./general/reply/reply";

export const RepliedPostCard = ({
	repliedPostId,
}: {
	repliedPostId: number;
}) => {
	const [parentPost, setParentPost] = useState<PostDetail | null>(null);

	useEffect(() => {
		const fetchParent = async () => {
			try {
				const res = await fetchPostDetail(repliedPostId.toString());
				setParentPost(res);
			} catch (error) {
				console.error("Failed to fetch post details:", error);
				// Optionally, you can set a fallback state or notify the user here
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
