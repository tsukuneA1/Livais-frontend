import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { apiTools, executeApiTool } from "./api-tools";

export class ApiMcpServer {
	private server: Server;

	constructor() {
		this.server = new Server(
			{
				name: "api-server",
				version: "0.1.0",
			},
			{
				capabilities: {
					tools: {},
				},
			},
		);

		this.setupHandlers();
	}

	private setupHandlers() {
		this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
			tools: apiTools,
		}));

		this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
			const { name, arguments: args } = request.params;

			try {
				const result = await executeApiTool(name, args);

				if (result.success) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(result.data, null, 2),
							},
						],
					};
				} else {
					return {
						content: [
							{
								type: "text",
								text: `Error: ${result.error.message}`,
							},
						],
						isError: true,
					};
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error executing tool ${name}: ${error instanceof Error ? error.message : "Unknown error"}`,
						},
					],
					isError: true,
				};
			}
		});
	}

	async start() {
		const transport = new StdioServerTransport();
		await this.server.connect(transport);
		console.error("API MCP server running on stdio");
	}

	getServer() {
		return this.server;
	}
}

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

if (require.main === module) {
	const server = new ApiMcpServer();
	server.start().catch(console.error);
}
