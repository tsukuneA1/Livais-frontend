import { MainLayout } from "@/layouts/main/layout";

type UserPageProps = {
	params: Promise<{ id: string }>;
};

const UserPage = async ({ params }: UserPageProps) => {
	const { id } = await params;

	return (
		<MainLayout>
			<h1>{id}のユーザーページ</h1>
		</MainLayout>
	);
};

export default UserPage;
