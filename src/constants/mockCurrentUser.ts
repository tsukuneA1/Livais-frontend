import type { User } from "@/types/users";

export const MOCK_CURRENT_USER: User = {
	id: 1,
	createdAt: "2025-05-08T13:48:43.603Z",
	name: "Larry Shields",
	email: "christy_adams@reinger.example",
	password: "password",
	image: "https://robohash.org/doloribusmagniipsa.png?size=300x300&set=set1",
	isFollowing: false,
	profile: {
		id: 1,
		userId: 1,
		bio: "Eos ut cupiditate. Rerum vel nostrum.",
		createdAt: "2025-05-08T13:48:43.784Z",
		updatedAt: "2025-05-08T13:48:43.784Z",
	},
} as const;
