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

	async processMessage(message: string, userId?: number, token?: string): Promise<string> {
		try {
			console.log("LLM processor starting for message:", message);
			console.log("User ID:", userId);
			
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

			console.log("Making OpenAI API call with tools:", tools.length);
			const response = await this.openai.chat.completions.create({
				model: this.model,
				messages,
				tools,
				tool_choice: "auto",
			});
			console.log("OpenAI API response received");

			const assistantMessage = response.choices[0]?.message;
			console.log("Assistant message:", assistantMessage);

			if (!assistantMessage) {
				return "すみません、応答を生成できませんでした。";
			}

			// Function callsがある場合は実行
			if (
				assistantMessage.tool_calls &&
				assistantMessage.tool_calls.length > 0
			) {
				console.log("Processing tool calls:", assistantMessage.tool_calls.length);
				const results: string[] = [];

				for (const toolCall of assistantMessage.tool_calls) {
					if (toolCall.type === "function") {
						const functionName = toolCall.function.name;
						const functionArgs = JSON.parse(toolCall.function.arguments);
						console.log(`Executing function: ${functionName} with args:`, functionArgs);

						// userIdが必要な関数の場合は追加
						if (["likePost", "postReply"].includes(functionName) && userId) {
							functionArgs.userId = userId;
						}

						try {
							const result = await executeApiTool(functionName, functionArgs, token);
							console.log(`Function ${functionName} result:`, result);

							if (result.success) {
								// 成功時のレスポンス生成
								const successResponse = await this.generateSuccessResponse(
									functionName,
									functionArgs,
									result.data,
								);
								console.log("Success response:", successResponse);
								results.push(successResponse);
							} else {
								// エラー時のレスポンス生成
								const errorResponse = await this.generateErrorResponse(functionName, result.error);
								console.log("Error response:", errorResponse);
								results.push(errorResponse);
							}
						} catch (error) {
							console.error(`Error executing function ${functionName}:`, error);
							const errorMessage = `${functionName}の実行中にエラーが発生しました: ${error instanceof Error ? error.message : "不明なエラー"}`;
							console.log("Exception response:", errorMessage);
							results.push(errorMessage);
						}
					}
				}

				const finalResult = results.join("\n");
				console.log("Final LLM result:", finalResult);
				return finalResult;
			}

			// Function callsがない場合は通常の応答
			return (
				assistantMessage.content ||
				"申し訳ありませんが、適切な応答を生成できませんでした。"
			);
		} catch (error) {
			console.error("LLM processing error:", error);
			console.error("LLM error stack:", error instanceof Error ? error.stack : "No stack trace");
			console.error("LLM error details:", error instanceof Error ? error.message : error);
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
