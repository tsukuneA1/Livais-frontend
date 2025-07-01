import OpenAI from "openai";
import { apiTools, executeApiTool } from "./api-tools";

interface LLMProcessorConfig {
	apiKey: string;
	model?: string;
}

export class LLMProcessor {
	private openai: OpenAI;
	private model: string;

	constructor(config: LLMProcessorConfig) {
		this.openai = new OpenAI({
			apiKey: config.apiKey,
		});
		this.model = config.model || "gpt-3.5-turbo";
	}

	async processMessage(
		message: string,
		userId?: number,
		token?: string,
	): Promise<string> {
		try {
			const systemPrompt = `あなたはソーシャルメディアアプリのAIアシスタントです。
ユーザーの自然言語での要求を理解し、適切なAPI関数を呼び出してください。

利用可能な機能:
- 投稿の作成、取得、検索
- いいね、リポスト、引用投稿
- ユーザー情報の取得
- お知らせの確認

ユーザーが明確に指示していない場合は、まず詳細を確認してください。
エラーが発生した場合は、分かりやすく説明してください。`;

			const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
				{
					role: "system",
					content: systemPrompt,
				},
				{
					role: "user",
					content: message,
				},
			];

			const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = apiTools.map(
				(tool) => ({
					type: "function",
					function: {
						name: tool.name,
						description: tool.description,
						parameters: tool.inputSchema,
					},
				}),
			);

			const response = await this.openai.chat.completions.create({
				model: this.model,
				messages,
				tools,
				tool_choice: "auto",
			});

			const assistantMessage = response.choices[0]?.message;

			if (!assistantMessage) {
				return "すみません、応答を生成できませんでした。";
			}

			if (
				assistantMessage.tool_calls &&
				assistantMessage.tool_calls.length > 0
			) {
				const results: string[] = [];

				for (const toolCall of assistantMessage.tool_calls) {
					if (toolCall.type === "function") {
						const functionName = toolCall.function.name;
						const functionArgs = JSON.parse(toolCall.function.arguments);

						if (["likePost", "postReply"].includes(functionName) && userId) {
							functionArgs.userId = userId;
						}

						try {
							const result = await executeApiTool(
								functionName,
								functionArgs,
								token,
							);

							if (result.success) {
								const successResponse = await this.generateSuccessResponse(
									functionName,
									functionArgs,
									result.data,
								);
								results.push(successResponse);
							} else {
								const errorResponse = await this.generateErrorResponse(
									functionName,
									result.error,
								);
								results.push(errorResponse);
							}
						} catch (error) {
							console.error(`Error executing function ${functionName}:`, error);
							const errorMessage = `${functionName}の実行中にエラーが発生しました: ${error instanceof Error ? error.message : "不明なエラー"}`;
							results.push(errorMessage);
						}
					}
				}

				return results.join("\n");
			}

			return (
				assistantMessage.content ||
				"申し訳ありませんが、適切な応答を生成できませんでした。"
			);
		} catch (error) {
			console.error("LLM processing error:", error);
			return `AIの処理中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`;
		}
	}

	private async generateSuccessResponse(
		functionName: string,
		args: any,
		data?: any,
	): Promise<string> {
		switch (functionName) {
			case "createPost":
				return `投稿を作成しました: "${args.content}"`;

			case "fetchTimeline":
				if (!data || data.length === 0) {
					return "現在、タイムラインに投稿がありません。";
				}
				const timelineSummary = data
					.slice(0, 3)
					.map(
						(post: any) =>
							`・${post.user?.name || "匿名"}: ${post.content.substring(0, 50)}${post.content.length > 50 ? "..." : ""}`,
					)
					.join("\n");
				return `最新の投稿（${data.length}件中3件表示）:\n${timelineSummary}`;

			case "searchPosts":
				if (!data || data.length === 0) {
					return `「${args.query}」に関する投稿が見つかりませんでした。`;
				}
				const searchSummary = data
					.slice(0, 3)
					.map(
						(post: any) =>
							`・${post.user?.name || "匿名"}: ${post.content.substring(0, 50)}${post.content.length > 50 ? "..." : ""}`,
					)
					.join("\n");
				return `「${args.query}」の検索結果（${data.length}件中3件表示）:\n${searchSummary}`;

			case "likePost":
				return `投稿${args.postId}にいいねしました`;

			case "fetchMe":
				return `ユーザー情報:\n名前: ${data.name}\nメール: ${data.email}`;

			case "fetchNotice":
				if (!data || data.length === 0) {
					return "現在、お知らせはありません。";
				}
				const noticeSummary = data
					.slice(0, 3)
					.map(
						(notice: any) =>
							`・${notice.title}: ${notice.content.substring(0, 50)}${notice.content.length > 50 ? "..." : ""}`,
					)
					.join("\n");
				return `お知らせ（${data.length}件中3件表示）:\n${noticeSummary}`;

			case "postReply":
				return `返信を投稿しました: "${args.content}"`;

			case "repost":
				return `投稿${args.postId}をリポストしました`;

			case "quotePost":
				return `投稿を引用しました: "${args.content}"`;

			default:
				return "操作が正常に完了しました。";
		}
	}

	private async generateErrorResponse(
		functionName: string,
		error: any,
	): Promise<string> {
		const errorMessage = error?.message || "不明なエラーが発生しました";

		switch (functionName) {
			case "createPost":
				return `投稿の作成に失敗しました: ${errorMessage}`;
			case "fetchTimeline":
				return `タイムラインの取得に失敗しました: ${errorMessage}`;
			case "searchPosts":
				return `検索に失敗しました: ${errorMessage}`;
			case "likePost":
				return `いいねに失敗しました: ${errorMessage}`;
			case "fetchMe":
				return `ユーザー情報の取得に失敗しました: ${errorMessage}`;
			case "fetchNotice":
				return `お知らせの取得に失敗しました: ${errorMessage}`;
			default:
				return `操作に失敗しました: ${errorMessage}`;
		}
	}
}
