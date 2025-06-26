import { Notice } from "@/types/notice";
import { Result, Ok, Err } from "@/types/result";
import { apiClient } from "./api-client";
import { NoticeFetchError, NoticeHideError } from "@/types/api-errors";

export async function fetchNotice(): Promise<Result<Notice[]>> {
	const result = await apiClient.get<Notice[]>("/api/v1/notice/");

	if (!result.success) {
		return Err(new NoticeFetchError(result.error.message));
	}

	return Ok(result.data);
}

export async function hideNotice(id: number): Promise<Result<void>> {
	const result = await apiClient.post<void>(`/api/v1/notice/${id}/`);

	if (!result.success) {
		return Err(new NoticeHideError(result.error.message));
	}

	return Ok(undefined);
}
