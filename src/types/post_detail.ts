export type PostDetail = {
	id: number;
	content: string;
	createdAt: string;
	updatedAt: string;
	userId: number;
	replyToId: number | null;
	user: {
		id: number;
		name: string;
		image: string;
	};
	repliesCount: number;
	likesCount: number;
	repostsCount: number;
	replies: PostDetail[];
	isLiked: boolean;
	isReposted: boolean;
};
