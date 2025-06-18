import { PostCreationDialog } from "@/components/general/postCreationDialog/postCreationDialog";
import { Suspense } from "react";

export default function CreatePostPage() {
	return (
		<div className="flex justify-center items-start h-screen pt-10 bg-gray-100 dark:bg-gray-900">
			<div className="w-full max-w-2xl bg-white dark:bg-black rounded-lg shadow-xl">
				<Suspense fallback={<PageLoading />}>
					<PostCreationDialog />
				</Suspense>
			</div>
		</div>
	);
}

const PageLoading = () => {
	return <div className="p-8">コンテンツを読み込んでいます...</div>;
};
