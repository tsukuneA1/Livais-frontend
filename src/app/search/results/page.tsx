import { PostsSearchResult } from "@/components/domain/search/postsSearchResult";
import { UsersSearchResult } from "@/components/domain/search/userSearchResult";
import { PostCard } from "@/components/general/post/postCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/layouts/main/layout";
import { Post } from "@/types/post";

const api = {
	getTrendingPosts: async (query: string): Promise<Post[]> => {
		return [
			{
				id: 1,
				content: `「${query}」は今、最も話題のトピックです！`,
				createdAt: "2025-06-20T10:03:00Z",
				updatedAt: "2025-06-20T10:03:00Z",
				userId: 101,
				replyToId: null,
				user: {
					id: 101,
					name: "トレンド太郎",
					image: "https://i.pravatar.cc/150?u=trend_taro",
					isFollowing: false,
				},
				repliesCount: 5,
				likesCount: 25,
				repostsCount: 12,
				replies: [],
				isLiked: false,
				isReposted: true,
				quotedPost: null,
			},
			{
				id: 2,
				content: `${query}について、みんなで話そう！`,
				createdAt: "2025-06-20T09:55:00Z",
				updatedAt: "2025-06-20T09:55:00Z",
				userId: 102,
				replyToId: null,
				user: {
					id: 102,
					name: "話題好き子",
					image: "https://i.pravatar.cc/150?u=wadai_suki",
					isFollowing: true,
				},
				repliesCount: 15,
				likesCount: 150,
				repostsCount: 30,
				replies: [],
				isLiked: true,
				isReposted: false,
				quotedPost: null,
			},
		];
	},
};

type SearchResultsPageProps = {
	searchParams: Promise<{ q?: string }>;
};

const SearchResultsPage = async ({ searchParams }: SearchResultsPageProps) => {
	const resolvedSearchParams = await searchParams;
	const query = resolvedSearchParams?.q || "";

	if (!query) {
		return (
			<div className="container mx-auto py-12 text-center">
				<p>検索キーワードを入力してください。</p>
			</div>
		);
	}

	const [trendingPosts] = await Promise.all([api.getTrendingPosts(query)]);

	return (
		<MainLayout>
			<div className="container mx-auto max-w-3xl py-8">
				<div className="mb-6">
					<p className="text-sm text-muted-foreground">検索結果</p>
					<h1 className="text-2xl font-bold">{query}</h1>
				</div>

				<Tabs defaultValue="trending" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="trending">話題</TabsTrigger>
						<TabsTrigger value="latest">最新</TabsTrigger>
						<TabsTrigger value="users">アカウント</TabsTrigger>
					</TabsList>

					<TabsContent value="trending">
						<div className="space-y-4">
							{trendingPosts.length > 0 ? (
								trendingPosts.map((post) => (
									<PostCard key={post.id} post={post} />
								))
							) : (
								<p className="py-8 text-center text-muted-foreground">
									関連する話題の投稿はありませんでした。
								</p>
							)}
						</div>
					</TabsContent>

					<TabsContent value="latest">
						<PostsSearchResult />
					</TabsContent>

					<TabsContent value="users">
						<UsersSearchResult />
					</TabsContent>
				</Tabs>
			</div>
		</MainLayout>
	);
};

export default SearchResultsPage;
