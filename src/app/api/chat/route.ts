import { executeApiTool } from "@/lib/mcp/api-tools";
import { LLMProcessor } from "@/lib/mcp/llm-processor";
import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
	message: string;
	userId?: number;
}

const llmProcessor = new LLMProcessor({
	apiKey: process.env.OPENAI_API_KEY || "",
	model: "gpt-3.5-turbo",
});

export async function POST(request: NextRequest) {
	let message: string | undefined;
	let userId: number | undefined;

	try {
		const body: ChatMessage = await request.json();
		message = body.message;
		userId = body.userId;

		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!message) {
			return NextResponse.json(
				{ error: "Message is required" },
				{ status: 400 },
			);
		}

		if (!llmProcessor) {
			const response = await processNaturalLanguageRequestFallback(
				message,
				userId,
				token,
			);
			return NextResponse.json({ message: response });
		}

		const response = await llmProcessor.processMessage(message, userId, token);

		return NextResponse.json({ message: response });
	} catch (error) {
		console.error("Chat API error:", error);
		if (message) {
			try {
				const authHeader = request.headers.get("authorization");
				const token = authHeader?.replace("Bearer ", "");
				const fallbackResponse = await processNaturalLanguageRequestFallback(
					message,
					userId,
					token,
				);
				return NextResponse.json({ message: fallbackResponse });
			} catch (fallbackError) {
				console.error("Fallback processing failed:", fallbackError);
			}
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

async function processNaturalLanguageRequestFallback(
	message: string,
	userId?: number,
	token?: string,
): Promise<string> {
	const lowerMessage = message.toLowerCase();

	if (lowerMessage.includes("投稿") && lowerMessage.includes("作成")) {
		const content = extractContentFromMessage(message, "投稿");
		if (content) {
			try {
				const result = await executeApiTool("createPost", { content }, token);
				if (result.success) {
					return `投稿を作成しました: "${content}"`;
				} else {
					return `投稿の作成に失敗しました: ${result.error?.message}`;
				}
			} catch (error) {
				console.error("Error during post creation:", error);
				return "投稿の作成中にエラーが発生しました";
			}
		}
		return "投稿内容を指定してください。例: 「今日は良い天気です」という投稿を作成して";
	}

	if (
		lowerMessage.includes("タイムライン") ||
		lowerMessage.includes("投稿一覧")
	) {
		try {
			const result = await executeApiTool("fetchTimeline", {});
			if (result.success) {
				const posts = result.data as any[];
				if (!posts || posts.length === 0) {
					return "現在、タイムラインに投稿がありません。";
				}
				const summary = posts
					.slice(0, 3)
					.map(
						(post: any) =>
							`・${post.user?.name || "匿名"}: ${post.content.substring(0, 50)}${post.content.length > 50 ? "..." : ""}`,
					)
					.join("\n");
				return `最新の投稿（${posts.length}件中3件表示）:\n${summary}`;
			} else {
				return `タイムラインの取得に失敗しました: ${result.error?.message}`;
			}
		} catch {
			return "タイムラインの取得中にエラーが発生しました";
		}
	}

	if (lowerMessage.includes("検索")) {
		const query = extractContentFromMessage(message, "検索");
		if (query) {
			try {
				const result = await executeApiTool("searchPosts", { query });
				if (result.success) {
					const posts = result.data as any[];
					if (!posts || posts.length === 0) {
						return `「${query}」に関する投稿が見つかりませんでした。`;
					}
					const summary = posts
						.slice(0, 3)
						.map(
							(post: any) =>
								`・${post.user?.name || "匿名"}: ${post.content.substring(0, 50)}${post.content.length > 50 ? "..." : ""}`,
						)
						.join("\n");
					return `「${query}」の検索結果（${posts.length}件中3件表示）:\n${summary}`;
				} else {
					return `検索に失敗しました: ${result.error?.message}`;
				}
			} catch {
				return "検索中にエラーが発生しました";
			}
		}
		return "検索キーワードを指定してください。例: 「プログラミング」で検索して";
	}

	if (lowerMessage.includes("いいね") && lowerMessage.includes("投稿")) {
		const postIdMatch = message.match(/投稿(\d+)/);
		if (postIdMatch) {
			const postId = parseInt(postIdMatch[1]);
			try {
				const result = await executeApiTool("likePost", { postId, userId });
				if (result.success) {
					return `投稿${postId}にいいねしました`;
				} else {
					return `いいねに失敗しました: ${result.error?.message}`;
				}
			} catch {
				return "いいね中にエラーが発生しました";
			}
		}
		return "投稿IDを指定してください。例: 投稿123にいいねして";
	}

	if (
		lowerMessage.includes("ユーザー情報") ||
		lowerMessage.includes("プロフィール")
	) {
		try {
			const result = await executeApiTool("fetchMe", {});
			if (result.success) {
				const user = result.data as any;
				return `ユーザー情報:\n名前: ${user?.name || "不明"}\nメール: ${user?.email || "不明"}`;
			} else {
				return `ユーザー情報の取得に失敗しました: ${result.error?.message}`;
			}
		} catch {
			return "ユーザー情報の取得中にエラーが発生しました";
		}
	}

	if (lowerMessage.includes("お知らせ")) {
		try {
			const result = await executeApiTool("fetchNotice", {});
			if (result.success) {
				const notices = result.data as any[];
				if (!notices || notices.length === 0) {
					return "現在、お知らせはありません。";
				}
				const summary = notices
					.slice(0, 3)
					.map(
						(notice: any) =>
							`・${notice.title}: ${notice.content.substring(0, 50)}${notice.content.length > 50 ? "..." : ""}`,
					)
					.join("\n");
				return `お知らせ（${notices.length}件中3件表示）:\n${summary}`;
			} else {
				return `お知らせの取得に失敗しました: ${result.error?.message}`;
			}
		} catch {
			return "お知らせの取得中にエラーが発生しました";
		}
	}

	return `申し訳ありませんが、「${message}」のご要望を理解できませんでした。\n\n以下のような操作が可能です:\n・「今日は良い天気です」という投稿を作成して\n・タイムラインを表示して\n・「プログラミング」で検索して\n・投稿123にいいねして\n・ユーザー情報を表示して\n・お知らせを表示して`;
}

function extractContentFromMessage(
	message: string,
	action: string,
): string | null {
	const patterns = [
		new RegExp(`「([^」]+)」.*${action}`, "i"),
		new RegExp(`${action}.*「([^」]+)」`, "i"),
		new RegExp("「([^」]+)」", "i"),
	];

	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	if (action === "検索") {
		const searchPatterns = [
			/「([^」]+)」.*検索/i,
			/検索.*「([^」]+)」/i,
			/([^\s]+).*検索/i,
			/検索.*([^\s]+)/i,
		];

		for (const pattern of searchPatterns) {
			const match = message.match(pattern);
			if (match && match[1] && match[1] !== "検索") {
				return match[1];
			}
		}
	}

	return null;
}
