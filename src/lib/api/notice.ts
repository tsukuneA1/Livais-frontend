import { Notice } from "@/types/notice";

export async function fetchNotice(): Promise<Notice[]> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/notice/`,
		{
			method: "GET",
			cache: "no-store",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
		},
	);
	if (!response.ok) {
		throw new Error("Failed to fetch notices");
	}
	return (await response.json()) as Promise<Notice[]>;
}

export async function hideNotice(id: number): Promise<void> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/notice/${id}/`,
		{
			method: "POST",
			cache: "no-store",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
		},
	);
	if (!response.ok) {
		throw new Error("Failed to hide notice");
	}
}
