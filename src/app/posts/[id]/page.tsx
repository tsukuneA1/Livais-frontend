import { DetailPostCard } from "@/components/general/post/detailPostCard";
import { MainLayout } from "@/layouts/main/layout";

type PostPageProps = {
	params: Promise<{ id: string }>;
};

const PostPage = async ({ params }: PostPageProps) => {
	const { id } = await params;

	return (
		<MainLayout>
			<DetailPostCard id={id} />
		</MainLayout>
	);
};

export default PostPage;
