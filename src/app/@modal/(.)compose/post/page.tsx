import { PostCreationDialog } from "@/components/general/postCreationDialog/postCreationDialog";
import { Suspense } from "react";

const CreatePostModal = () => {
	return (
		<Suspense fallback={<div>loading</div>}>
			<PostCreationDialog />
		</Suspense>
	);
};

export default CreatePostModal;
