import { User } from "@/types/user";
import { Result, Ok, Err } from "@/types/result";
import { apiClient } from "./api-client";
import {
	SignupError,
	SigninError,
	GoogleAuthError,
	UserFetchError,
} from "@/types/api-errors";

type SignUpParams = {
	name: string;
	email: string;
	password: string;
};

type AuthResponse = {
	token: string;
	user: User;
}

export const signup = async ({ name, email, password }: SignUpParams): Promise<Result<AuthResponse>> => {
	const result = await apiClient.post("/api/v1/auth/signup", {
		user: {
			name,
			email,
			password,
			password_confirmation: password,
			image: null,
		},
	}, { requireAuth: false });

	if (!result.success) {
		return Err(new SignupError(result.error.message));
	}

	return Ok(result.data as AuthResponse);
};

export const signin = async (email: string, password: string): Promise<Result<AuthResponse>> => {
	const result = await apiClient.post("/api/v1/auth/signin", { email, password }, { requireAuth: false });

	if (!result.success) {
		return Err(new SigninError(result.error.message));
	}

	return Ok(result.data as AuthResponse);
};

export const signinWithGoogle = async (credential: string): Promise<Result<AuthResponse>> => {
	const result = await apiClient.post("/api/v1/auth/google", { credential }, { requireAuth: false });

	if (!result.success) {
		return Err(new GoogleAuthError(result.error.message));
	}

	return Ok(result.data as AuthResponse);
};

export const fetchMe = async (): Promise<Result<User | null>> => {
	const result = await apiClient.get<User>("/api/v1/auth/me");

	if (!result.success) {
		console.error("Error fetching user data:", result.error);
		return Err(new UserFetchError(result.error.message));
	}

	return Ok(result.data);
};
