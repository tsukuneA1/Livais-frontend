"use client";

// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const SearchPage = () => {
// 	const [searchQuery, setSearchQuery] = useState("");
// 	const router = useRouter();

// 	const handleSearch = (e: React.FormEvent) => {
// 		e.preventDefault();
// 		if (searchQuery.trim()) {
// 			router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
// 		}
// 	};

// 	return (
// 		<div className="max-w-2xl mx-auto p-4">
// 			<div className="space-y-4">
// 				<h1 className="text-2xl font-bold">検索</h1>

// 				<form onSubmit={handleSearch} className="relative">
// 					<div className="relative">
// 						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
// 						<Input
// 							type="text"
// 							placeholder="検索ワードを入力..."
// 							value={searchQuery}
// 							onChange={(e) => setSearchQuery(e.target.value)}
// 							className="pl-10 py-6 text-lg rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500"
// 						/>
// 					</div>
// 				</form>
// 				{searchQuery}
// 				<div className="mt-8">
// 					<h2 className="text-xl font-semibold mb-4">トレンド</h2>
// 					<div className="space-y-4">
// 						{[1, 2, 3].map((item) => (
// 							<div
// 								key={item}
// 								className="p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
// 							>
// 								<p className="text-sm text-gray-500">トレンド #{item}</p>
// 								<p className="font-medium">サンプルトレンド {item}</p>
// 								<p className="text-sm text-gray-500">1,234 投稿</p>
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default SearchPage;

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchPage = () => {
	return (
		<div className="container mx-auto max-w-xl py-12">
			<h1 className="mb-6 text-center text-3xl font-bold">検索</h1>
			<form action="/search/results" method="GET">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						name="q"
						placeholder="キーワードを検索..."
						className="w-full rounded-full pl-10 text-lg"
						required
					/>
				</div>
			</form>
		</div>
	);
};

export default SearchPage;
