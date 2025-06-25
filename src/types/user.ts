export type User = {
	id: number;
	createdAt: string;
	image: string;
	name: string;
	email: string;
	password: string;
	isFollowing: boolean;
	profile: {
		id: number;
		userId: number;
		selfIntroduction: string;
		createdAt: string;
		updatedAt: string;
	};
};
