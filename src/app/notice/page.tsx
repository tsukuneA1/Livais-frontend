import { NoticeCard } from "@/components/general/notice/noticeCard";
import { MainLayout } from "@/layouts/main/layout";
import { fetchNotice } from "@/lib/api/notice";
import { Notice } from "@/types/notice";

const NoticePage = async () => {
	const notices = await fetchNotice();

	return (
		<MainLayout>
			<div className="bg-gray-50 min-h-screen">
				<h1 className="flex py-2 w-full font-bold justify-center items-center">
					通知
				</h1>
				<div className="flex justify-center items-center">
					{notices.map((notice: Notice) => (
						<NoticeCard key={notice.id} notice={notice} />
					))}
				</div>
			</div>
		</MainLayout>
	);
};

export default NoticePage;
