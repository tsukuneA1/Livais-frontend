import { DetailPost } from "@/components/general/post/detailPost";
import { MainLayout } from "@/layouts/main/layout";

const PostIdPage = ({ params }: { params: { id: string } }) => {
	const { id } = params;

	return (
		<MainLayout>
			<DetailPost id={id} />
		</MainLayout>
	);
};

export default PostIdPage;
