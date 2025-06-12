import { DetailPost } from "@/components/general/post/detailPost";
import { MainLayout } from "@/layouts/main/layout";

type PostIdPageProps = {
	params: Promise<{ id: string }>;
};

const PostIdPage = async ({ params }: PostIdPageProps) => {
	const { id } = await params;

	return (
		<MainLayout>
			<DetailPost id={id} />
		</MainLayout>
	);
};

export default PostIdPage;
