import { Post } from "@/components/general/post/post";
import { MainLayout } from "@/layouts/main/layout";
import type { Post as PostType } from "@/types/post";

type UserPageProps = {
	params: Promise<{ userId: string }>;
};

export default async function Page({ params }: UserPageProps) {
	const { userId } = await params;

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
