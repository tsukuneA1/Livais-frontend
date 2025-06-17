"use client";

import { NoticeCard } from "@/components/general/notice/noticeCard";
import { fetchNotice } from "@/lib/api/notice";
import { Notice } from "@/types/notice";
import { useEffect, useState } from "react";

export const NoticeFetcher = () => {
	const [notices, setNotices] = useState<Notice[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getNotices = async () => {
			try {
				const fetchedNotices = await fetchNotice();
				setNotices(fetchedNotices);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Failed to fetch notices: An unknown error occurred.");
				}
			} finally {
				setLoading(false);
			}
		};

		getNotices();
	}, []);

	if (loading) {
		return <div>Loading notices...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="flex flex-col justify-center items-center">
			{notices.map((notice) => (
				<NoticeCard key={notice.id} notice={notice} />
			))}
		</div>
	);
};
