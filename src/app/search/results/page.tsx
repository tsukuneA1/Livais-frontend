import { PostCard } from "@/components/general/post/postCard";
import { UserCard } from "@/components/general/user/userCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@/types/post";
import { User } from "@/types/users";

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

	getLatestPosts: async (query: string): Promise<Post[]> => {
		return [
			{
				id: 3,
				content: `【最新】${query}に関する情報です。`,
				createdAt: "2025-06-20T10:04:00Z",
				updatedAt: "2025-06-20T10:04:00Z",
				userId: 103,
				replyToId: null,
				user: {
					id: 103,
					name: "速報次郎",
					image: "https://i.pravatar.cc/150?u=sokuho_jiro",
					isFollowing: false,
				},
				repliesCount: 0,
				likesCount: 2,
				repostsCount: 1,
				replies: [],
				isLiked: false,
				isReposted: false,
				quotedPost: null,
			},
		];
	},

	getRelatedAccounts: async (query: string): Promise<User[]> => {
		return [
			{
				id: 201,
				createdAt: "2024-01-01T00:00:00Z",
				image: "https://i.pravatar.cc/150?u=query_official",
				name: `${query}公式`,
				email: "official@query.com",
				password: "dummy_password",
				isFollowing: false,
				profile: {
					id: 301,
					userId: 201,
					bio: `${query}の公式情報をお届けします。`,
					createdAt: "2024-01-01T00:00:00Z",
					updatedAt: "2024-01-01T00:00:00Z",
				},
			},
			{
				id: 202,
				createdAt: "2023-05-10T00:00:00Z",
				image: "https://i.pravatar.cc/150?u=expert_of_q",
				name: `${query}専門家`,
				email: "expert@query.dev",
				password: "dummy_password",
				isFollowing: false,
				profile: {
					id: 302,
					userId: 202,
					bio: `${query}に関する知見を、エンジニアリングの観点から共有します。`,
					createdAt: "2023-05-10T00:00:00Z",
					updatedAt: "2023-05-10T00:00:00Z",
				},
			},
		];
	},
};

type SearchResultsPageProps = {
	params: Promise<{ q?: string }>;
};

const SearchResultsPage = async ({ params }: SearchResultsPageProps) => {
	const resolvedSearchParams = await params;
	const query = resolvedSearchParams?.q || "";

	if (!query) {
		return (
			<div className="container mx-auto py-12 text-center">
				<p>検索キーワードを入力してください。</p>
			</div>
		);
	}

	const [trendingPosts, latestPosts, relatedAccounts] = await Promise.all([
		api.getTrendingPosts(query),
		api.getLatestPosts(query),
		api.getRelatedAccounts(query),
	]);

	return (
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
					<div className="space-y-4">
						{latestPosts.length > 0 ? (
							latestPosts.map((post) => <PostCard key={post.id} post={post} />)
						) : (
							<p className="py-8 text-center text-muted-foreground">
								関連する最新の投稿はありませんでした。
							</p>
						)}
					</div>
				</TabsContent>

				<TabsContent value="users">
					<div className="space-y-4">
						{relatedAccounts.length > 0 ? (
							relatedAccounts.map((account) => (
								<UserCard key={account.id} user={account} />
							))
						) : (
							<p className="py-8 text-center text-muted-foreground">
								関連するアカウントは見つかりませんでした。
							</p>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default SearchResultsPage;
