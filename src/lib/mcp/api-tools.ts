import { Tool } from "@modelcontextprotocol/sdk/types.js";
import * as auth from "../api/auth";
import * as notice from "../api/notice";
import * as post from "../api/post";
import * as search from "../api/search";

export const apiTools: Tool[] = [
	{
		name: "signup",
		description: "新規ユーザー登録を行います",
		inputSchema: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "ユーザー名",
				},
				email: {
					type: "string",
					description: "メールアドレス",
				},
				password: {
					type: "string",
					description: "パスワード",
				},
			},
			required: ["name", "email", "password"],
		},
	},
	{
		name: "signin",
		description: "ユーザーログインを行います",
		inputSchema: {
			type: "object",
			properties: {
				email: {
					type: "string",
					description: "メールアドレス",
				},
				password: {
					type: "string",
					description: "パスワード",
				},
			},
			required: ["email", "password"],
		},
	},
	{
		name: "fetchMe",
		description: "現在のユーザー情報を取得します",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "fetchNotice",
		description: "お知らせ一覧を取得します",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "hideNotice",
		description: "お知らせを非表示にします",
		inputSchema: {
			type: "object",
			properties: {
				id: {
					type: "number",
					description: "お知らせID",
				},
			},
			required: ["id"],
		},
	},
	{
		name: "fetchTimeline",
		description: "タイムラインの投稿一覧を取得します",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "fetchPostDetail",
		description: "特定の投稿の詳細を取得します",
		inputSchema: {
			type: "object",
			properties: {
				postId: {
					type: "string",
					description: "投稿ID",
				},
			},
			required: ["postId"],
		},
	},
	{
		name: "createPost",
		description: "新しい投稿を作成します",
		inputSchema: {
			type: "object",
			properties: {
				content: {
					type: "string",
					description: "投稿内容",
				},
			},
			required: ["content"],
		},
	},
	{
		name: "postReply",
		description: "投稿に返信します",
		inputSchema: {
			type: "object",
			properties: {
				content: {
					type: "string",
					description: "返信内容",
				},
				replyToId: {
					type: "number",
					description: "返信先の投稿ID",
				},
			},
			required: ["content", "replyToId"],
		},
	},
	{
		name: "likePost",
		description: "投稿にいいねします",
		inputSchema: {
			type: "object",
			properties: {
				postId: {
					type: "number",
					description: "投稿ID",
				},
				userId: {
					type: "number",
					description: "ユーザーID",
				},
			},
			required: ["postId"],
		},
	},
	{
		name: "repost",
		description: "投稿をリポストします",
		inputSchema: {
			type: "object",
			properties: {
				postId: {
					type: "number",
					description: "投稿ID",
				},
			},
			required: ["postId"],
		},
	},
	{
		name: "quotePost",
		description: "投稿を引用して投稿します",
		inputSchema: {
			type: "object",
			properties: {
				quotedPostId: {
					type: "number",
					description: "引用する投稿ID",
				},
				content: {
					type: "string",
					description: "引用コメント",
				},
			},
			required: ["quotedPostId", "content"],
		},
	},
	{
		name: "searchPosts",
		description: "投稿を検索します",
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: "検索クエリ",
				},
			},
			required: ["query"],
		},
	},
	{
		name: "searchUsers",
		description: "ユーザーを検索します",
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: "検索クエリ",
				},
			},
			required: ["query"],
		},
	},
];

export const executeApiTool = async (
	name: string,
	args: Record<string, unknown>,
	token?: string,
) => {
	if (token && typeof window === "undefined") {
		(global as any).__authToken = token;
	}
	switch (name) {
		case "signup":
			return await auth.signup(args);
		case "signin":
			return await auth.signin(args.email, args.password);
		case "fetchMe":
			return await auth.fetchMe();
		case "fetchNotice":
			return await notice.fetchNotice();
		case "hideNotice":
			return await notice.hideNotice(args.id);
		case "fetchTimeline":
			return await post.fetchTimeline();
		case "fetchPostDetail":
			return await post.fetchPostDetail(args.postId);
		case "createPost":
			return await post.createPost(args.content);
		case "postReply":
			return await post.postReply(args);
		case "likePost":
			return await post.likePost(args);
		case "repost":
			return await post.repost(args);
		case "quotePost":
			return await post.quotePost(args);
		case "searchPosts":
			return await search.searchPosts(args.query);
		case "searchUsers":
			return await search.searchUsers(args.query);
		default:
			throw new Error(`Unknown tool: ${name}`);
	}
};
