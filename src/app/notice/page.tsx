"use client";

import { NoticeCard } from "@/components/general/notice/noticeCard";
import { fetchNotice } from "@/lib/api/notice";
import { Notice } from "@/types/notice";
import { useEffect, useState } from "react";

export default function NoticePage() {
	const [notices, setNotices] = useState<Notice[]>([]);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		setToken(localStorage.getItem("token"));
	}, []);

	useEffect(() => {
		if (!token) return;

		async function load() {
			const notices = await fetchNotice(token as string);
			setNotices(notices);
		}
		load();
	}, []);

	return (
		<div className="bg-gray-50 min-h-screen">
			<h1 className="flex py-2 w-full font-bold justify-center items-center">
				通知
			</h1>
			<div className="flex justify-center items-center">
				{notices.map((notice: Notice) => (
					<NoticeCard key={notice.id} notice={notice} />
				))}
			</div>
		</div>
	);
}
