import { Post } from "@/components/general/post/post";
import { MainLayout } from "@/layouts/main/layout";
import type { Post as PostType } from "@/types/post";
import { v4 as uuidv4 } from "uuid";

type Props = {
	params: {
		id: string;
	};
};

export default async function Page({ params }: Props) {
	const userId = params.id;

	const userPostsRes = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts/user/${userId}`,
		{
			cache: "no-store",
		},
	);

	if (!userPostsRes.ok) {
		throw new Error(`Failed to fetch post with id: ${userId}`);
	}

	const posts: PostType[] = await userPostsRes.json();

	return (
		<MainLayout>
			{posts.map((post) => (
				<Post key={post.id} post={post} />
			))}
		</MainLayout>
	);
}
