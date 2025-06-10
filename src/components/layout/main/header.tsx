import { BotMessageSquare } from "lucide-react";

export const Header = () => {
	return (
		<header className="p-3">
			{/* TODO: 本番用のアイコン設定 */}
			<BotMessageSquare aria-hidden="true" />
		</header>
	);
};
