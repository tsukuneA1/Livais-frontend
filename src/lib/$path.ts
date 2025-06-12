const buildSuffix = (url?: {
	query?: Record<
		string,
		string | number | boolean | Array<string | number | boolean>
	>;
	hash?: string;
}) => {
	const query = url?.query;
	const hash = url?.hash;
	if (!query && !hash) return "";
	const search = (() => {
		if (!query) return "";

		const params = new URLSearchParams();

		Object.entries(query).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach((item) => params.append(key, String(item)));
			} else {
				params.set(key, String(value));
			}
		});

		return `?${params.toString()}`;
	})();
	return `${search}${hash ? `#${hash}` : ""}`;
};

export const pagesPath = {
	notice: {
		$url: (url?: { hash?: string }) => ({
			pathname: "/notice" as const,
			hash: url?.hash,
			path: `/notice${buildSuffix(url)}`,
		}),
	},
	posts: {
		_id: (id: string | number) => ({
			$url: (url?: { hash?: string }) => ({
				pathname: "/posts/[id]" as const,
				query: { id },
				hash: url?.hash,
				path: `/posts/${id}${buildSuffix(url)}`,
			}),
		}),
		new: {
			$url: (url?: { hash?: string }) => ({
				pathname: "/posts/new" as const,
				hash: url?.hash,
				path: `/posts/new${buildSuffix(url)}`,
			}),
		},
	},
	search: {
		$url: (url?: { hash?: string }) => ({
			pathname: "/search" as const,
			hash: url?.hash,
			path: `/search${buildSuffix(url)}`,
		}),
	},
	signin: {
		$url: (url?: { hash?: string }) => ({
			pathname: "/signin" as const,
			hash: url?.hash,
			path: `/signin${buildSuffix(url)}`,
		}),
	},
	signup: {
		$url: (url?: { hash?: string }) => ({
			pathname: "/signup" as const,
			hash: url?.hash,
			path: `/signup${buildSuffix(url)}`,
		}),
	},
	users: {
		_id: (id: string | number) => ({
			$url: (url?: { hash?: string }) => ({
				pathname: "/users/[id]" as const,
				query: { id },
				hash: url?.hash,
				path: `/users/${id}${buildSuffix(url)}`,
			}),
		}),
	},
	$url: (url?: { hash?: string }) => ({
		pathname: "/" as const,
		hash: url?.hash,
		path: `/${buildSuffix(url)}`,
	}),
};

export type PagesPath = typeof pagesPath;
