import { NoticeFetcher } from "@/components/domain/notice/noticeFetcher";
import { MainLayout } from "@/layouts/main/layout";

const NoticePage = async () => {
	return (
		<MainLayout>
			<div className="bg-gray-50 min-h-screen">
				<h1 className="flex py-2 w-full font-bold justify-center items-center">
					通知
				</h1>
				<NoticeFetcher />
			</div>
		</MainLayout>
	);
};

export default NoticePage;
