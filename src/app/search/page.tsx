import { Input } from "@/components/ui/input";
import { pagesPath } from "@/lib/$path";
import { Search } from "lucide-react";

const SearchPage = () => {
	return (
		<div className="container mx-auto max-w-xl py-12">
			<h1 className="mb-6 text-center text-3xl font-bold">検索</h1>
			<form action={pagesPath.search.results.$url().path} method="GET">
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
