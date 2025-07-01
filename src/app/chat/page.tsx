"use client";

import { useUser } from "@/app/context/user-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { user } = useUser();

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const token = localStorage.getItem("token");
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token && { Authorization: `Bearer ${token}` }),
				},
				body: JSON.stringify({
					message: input,
					userId: user?.id,
				}),
			});

			const result = await response.json();

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: result.message || "申し訳ありませんが、エラーが発生しました。",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: "申し訳ありませんが、接続エラーが発生しました。",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
			<Card className="flex-1 flex flex-col">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bot className="h-5 w-5" />
						AIアシスタント
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 flex flex-col">
					<div className="flex-1 overflow-y-auto space-y-4 mb-4">
						{messages.length === 0 && (
							<div className="text-center text-muted-foreground py-8">
								<Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>こんにちは！何かお手伝いできることはありますか？</p>
								<p className="text-sm mt-2">
									投稿の作成、検索、いいね、リポストなどができます。
								</p>
							</div>
						)}

						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex items-start gap-3 ${
									message.role === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`flex items-start gap-3 max-w-[80%] ${
										message.role === "user" ? "flex-row-reverse" : "flex-row"
									}`}
								>
									<div className="flex-shrink-0">
										{message.role === "user" ? (
											<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
												<User className="h-4 w-4 text-primary-foreground" />
											</div>
										) : (
											<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
												<Bot className="h-4 w-4 text-secondary-foreground" />
											</div>
										)}
									</div>
									<div
										className={`rounded-lg p-3 ${
											message.role === "user"
												? "bg-primary text-primary-foreground"
												: "bg-secondary"
										}`}
									>
										<p className="whitespace-pre-wrap">{message.content}</p>
										<p className="text-xs opacity-70 mt-1">
											{message.timestamp.toLocaleTimeString()}
										</p>
									</div>
								</div>
							</div>
						))}

						{isLoading && (
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
									<Bot className="h-4 w-4 text-secondary-foreground" />
								</div>
								<div className="bg-secondary rounded-lg p-3">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-current rounded-full animate-bounce" />
										<div
											className="w-2 h-2 bg-current rounded-full animate-bounce"
											style={{ animationDelay: "0.1s" }}
										/>
										<div
											className="w-2 h-2 bg-current rounded-full animate-bounce"
											style={{ animationDelay: "0.2s" }}
										/>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					<form onSubmit={handleSubmit} className="flex gap-2">
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="メッセージを入力してください..."
							disabled={isLoading}
							className="flex-1"
						/>
						<Button type="submit" disabled={isLoading || !input.trim()}>
							<Send className="h-4 w-4" />
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
