"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { pagesPath } from "@/lib/$path";
import { signinWithGoogle, signup } from "@/lib/api/auth";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { ArrowRight, AtSign, KeyRound, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "../context/user-context";

export default function SignUpPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { setUser } = useUser();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const data = await signup({ name, email, password });
			localStorage.setItem("token", data.token);
			alert("サインアップ成功");
		} catch (err) {
			if (err instanceof Error) {
				alert(`エラー: ${err.message}`);
			}
		}
	};

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						アカウント作成
					</h1>
					<p className="text-sm text-muted-foreground">
						以下の情報を入力して新しいアカウントを作成してください
					</p>
				</div>

				<div className="grid gap-6">
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">ユーザー名</Label>
							<div className="relative">
								<User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="name"
									placeholder="username"
									autoCapitalize="none"
									autoCorrect="off"
									className="pl-9"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">メールアドレス</Label>
							<div className="relative">
								<AtSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									placeholder="name@example.com"
									type="email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect="off"
									className="pl-9"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">パスワード</Label>
							<div className="relative">
								<KeyRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="password"
									type="password"
									autoCapitalize="none"
									autoComplete="new-password"
									className="pl-9"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>
						<Button className="w-full" onClick={handleSignup}>
							アカウント作成
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<Separator className="w-full" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								または
							</span>
						</div>
					</div>

					<div className="grid gap-2">
						<GoogleLogin
							onSuccess={async (credentialResponse: CredentialResponse) => {
								if (credentialResponse.credential) {
									try {
										const data = await signinWithGoogle(
											credentialResponse.credential,
										);
										localStorage.setItem("token", data.token);
										setUser(data.user);
										alert(`Googleでようこそ ${data.user.name}`);
										window.location.href = "/";
									} catch {
										alert("Googleログインに失敗しました");
									}
								}
							}}
							onError={() => {
								alert("Googleログインが失敗しました");
							}}
						/>
					</div>
				</div>

				<div className="px-8 text-center text-sm text-muted-foreground">
					すでにアカウントをお持ちですか？{" "}
					<Link
						href={pagesPath.signin.$url()}
						className="underline underline-offset-4 hover:text-primary"
					>
						サインイン
					</Link>
				</div>
			</div>
		</div>
	);
}
