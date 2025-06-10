import { TimelineFetcher } from "@/components/domain/timeline/timelineFetcher";
import { MainLayout } from "@/layouts/main/layout";

const Home = () => {
	return (
		<MainLayout>
			<TimelineFetcher />
		</MainLayout>
	);
};

export default Home;
