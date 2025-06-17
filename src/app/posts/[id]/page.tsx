import { DetailPost } from "@/components/general/post/detailPost";
import { MainLayout } from "@/layouts/main/layout";

type PostPageProps = {
	params: Promise<{ id: string }>;
};

const PostPage = async ({ params }: PostPageProps) => {
	const { id } = await params;

	return (
		<MainLayout>
			<DetailPost id={id} />
		</MainLayout>
	);
};

export default PostPage;
