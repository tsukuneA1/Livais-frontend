export class ApiError extends Error {
	constructor(message: string, public status?: number) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class NetworkError extends ApiError {
	constructor(message = "ネットワークエラーが発生しました") {
		super(message);
	}
}

export class AuthenticationError extends ApiError {
	constructor(message = "認証に失敗しました") {
		super(message, 401);
	}
}

export class AuthorizationError extends ApiError {
	constructor(message = "認可に失敗しました") {
		super(message, 403);
	}
}

export class ValidationError extends ApiError {
	constructor(message = "バリデーションエラーです") {
		super(message, 400);
	}
}

export class NotFoundError extends ApiError {
	constructor(message = "リソースが見つかりません") {
		super(message, 404);
	}
}

export class ServerError extends ApiError {
	constructor(message = "サーバーエラーが発生しました") {
		super(message, 500);
	}
}

export class SignupError extends ValidationError {
	constructor(message = "サインアップに失敗しました") {
		super(message);
	}
}

export class SigninError extends AuthenticationError {
	constructor(message = "サインインに失敗しました") {
		super(message);
	}
}

export class GoogleAuthError extends AuthenticationError {
	constructor(message = "Googleサインアップに失敗しました") {
		super(message);
	}
}

export class UserFetchError extends ApiError {
	constructor(message = "ユーザー情報の取得に失敗しました") {
		super(message);
	}
}

export class NoticeFetchError extends ApiError {
	constructor(message = "通知の取得に失敗しました") {
		super(message);
	}
}

export class NoticeHideError extends ApiError {
	constructor(message = "通知の非表示に失敗しました") {
		super(message);
	}
}

export class TimelineFetchError extends ApiError {
	constructor(message = "タイムラインの取得に失敗しました") {
		super(message);
	}
}

export class PostFetchError extends ApiError {
	constructor(message = "投稿の取得に失敗しました") {
		super(message);
	}
}

export class PostCreateError extends ApiError {
	constructor(message = "投稿の作成に失敗しました") {
		super(message);
	}
}

export class ReplyPostError extends ApiError {
	constructor(message = "返信の投稿に失敗しました") {
		super(message);
	}
}

export class LikePostError extends ApiError {
	constructor(message = "いいねに失敗しました") {
		super(message);
	}
}

export class RepostError extends ApiError {
	constructor(message = "リポストに失敗しました") {
		super(message);
	}
}

export class QuotePostError extends ApiError {
	constructor(message = "引用投稿に失敗しました") {
		super(message);
	}
}

export class SearchPostsError extends ApiError {
	constructor(message = "投稿の検索に失敗しました") {
		super(message);
	}
}

export class SearchUsersError extends ApiError {
	constructor(message = "ユーザーの検索に失敗しました") {
		super(message);
	}
}