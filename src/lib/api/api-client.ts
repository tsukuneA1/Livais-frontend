import {
	ApiError,
	AuthenticationError,
	AuthorizationError,
	NetworkError,
	NotFoundError,
	ServerError,
	ValidationError,
} from "@/types/api-errors";
import { Err, Ok, Result } from "@/types/result";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type RequestBody =
	| Record<string, unknown>
	| string
	| FormData
	| null
	| undefined;

interface ErrorResponse {
	error?: string;
	message?: string;
}

export interface ApiRequestConfig {
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: RequestBody;
	credentials?: RequestCredentials;
	cache?: RequestCache;
	requireAuth?: boolean;
}

export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "") {
		this.baseUrl = baseUrl;
	}

	private getAuthHeaders(): Record<string, string> {
		let token: string | null = null;
		
		if (typeof window !== "undefined") {
			// Client-side: use localStorage
			token = localStorage.getItem("token");
		} else {
			// Server-side: use global variable
			token = (global as any).__authToken || null;
		}
		
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	private getDefaultHeaders(body?: RequestBody): Record<string, string> {
		const headers: Record<string, string> = {};

		// FormDataの場合は Content-Type を設定しない（ブラウザが自動設定）
		if (!(body instanceof FormData)) {
			headers["Content-Type"] = "application/json";
		}

		return headers;
	}

	private mapStatusToError(status: number, message: string): ApiError {
		switch (status) {
			case 400:
				return new ValidationError(message);
			case 401:
				return new AuthenticationError(message);
			case 403:
				return new AuthorizationError(message);
			case 404:
				return new NotFoundError(message);
			case 500:
			case 502:
			case 503:
			case 504:
				return new ServerError(message);
			default:
				return new ApiError(message, status);
		}
	}

	async request<T>(
		endpoint: string,
		config: ApiRequestConfig = {},
	): Promise<Result<T>> {
		try {
			const {
				method = "GET",
				headers = {},
				body,
				credentials = "include",
				cache = "no-store",
				requireAuth = true,
			} = config;

			const url = `${this.baseUrl}${endpoint}`;
			const requestHeaders = {
				...this.getDefaultHeaders(body),
				...(requireAuth ? this.getAuthHeaders() : {}),
				...headers,
			};

			console.log("API Client making request:");
			console.log("  URL:", url);
			console.log("  Method:", method);
			console.log("  Headers:", requestHeaders);
			console.log("  Body:", body);
			console.log("  Require Auth:", requireAuth);

			const requestInit: RequestInit = {
				method,
				headers: requestHeaders,
				credentials,
				cache,
			};

			if (body && method !== "GET") {
				if (typeof body === "string" || body instanceof FormData) {
					requestInit.body = body;
				} else {
					requestInit.body = JSON.stringify(body);
				}
			}

			console.log("  Final request init:", requestInit);

			const response = await fetch(url, requestInit);
			
			console.log("Response received:");
			console.log("  Status:", response.status);
			console.log("  Status text:", response.statusText);
			console.log("  OK:", response.ok);

			if (!response.ok) {
				let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
				try {
					const errorData: ErrorResponse = await response.json();
					errorMessage = errorData.error || errorData.message || errorMessage;
				} catch {
					// JSON解析に失敗した場合はデフォルトメッセージを使用
				}

				const error = this.mapStatusToError(response.status, errorMessage);
				return Err(error);
			}

			const data = await response.json();
			return Ok(data as T);
		} catch (error) {
			console.error("API Client catch block error:", error);
			console.error("Error type:", typeof error);
			console.error("Error constructor:", error?.constructor?.name);
			console.error("Error message:", error instanceof Error ? error.message : error);
			console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
			
			if (error instanceof TypeError && error.message.includes("fetch")) {
				console.log("Network error detected");
				return Err(new NetworkError("ネットワーク接続に失敗しました"));
			}
			
			const apiError = error instanceof ApiError
				? error
				: new ApiError(`予期しないエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
			
			console.log("Returning API error:", apiError);
			return Err(apiError);
		}
	}

	async get<T>(
		endpoint: string,
		config?: Omit<ApiRequestConfig, "method">,
	): Promise<Result<T>> {
		return this.request<T>(endpoint, { ...config, method: "GET" });
	}

	async post<T>(
		endpoint: string,
		body?: RequestBody,
		config?: Omit<ApiRequestConfig, "method" | "body">,
	): Promise<Result<T>> {
		return this.request<T>(endpoint, { ...config, method: "POST", body });
	}

	async put<T>(
		endpoint: string,
		body?: RequestBody,
		config?: Omit<ApiRequestConfig, "method" | "body">,
	): Promise<Result<T>> {
		return this.request<T>(endpoint, { ...config, method: "PUT", body });
	}

	async delete<T>(
		endpoint: string,
		config?: Omit<ApiRequestConfig, "method">,
	): Promise<Result<T>> {
		return this.request<T>(endpoint, { ...config, method: "DELETE" });
	}

	async patch<T>(
		endpoint: string,
		body?: RequestBody,
		config?: Omit<ApiRequestConfig, "method" | "body">,
	): Promise<Result<T>> {
		return this.request<T>(endpoint, { ...config, method: "PATCH", body });
	}
}

export const apiClient = new ApiClient();
