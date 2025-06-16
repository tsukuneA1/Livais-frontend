export type Notice = {
	id: number;
	user: {
		id: number;
		name: string;
		image: string;
		isFollowing: boolean;
	};
	post?: {
		id: number;
		content: string;
	};
	notifiableType: NotifiableType;
	notifiableId: number;
	createdAt: string;
	updatedAt: string;
};

export enum NotifiableType {
	Like = "Like",
	Repost = "Repost",
	Reply = "Reply",
	Follow = "Follow",
}
