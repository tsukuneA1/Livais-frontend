import { UserIcon } from "@/components/general/userIcon/userIcon";
import { Card, CardContent } from "@/components/ui/card";
import { pagesPath } from "@/lib/$path";
import { User } from "@/types/users";
import Link from "next/link";

export const UserCard = ({ user }: { user: User }) => {
	return (
		<Link href={pagesPath.users._id(user.id).$url().path}>
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-start space-x-4">
						<UserIcon iconInfo={{ ...user }} />
						<div className="flex-1">
							<p className="font-bold">{user.name}</p>
							<p className="text-sm text-muted-foreground">@{user.name}</p>
							<p className="mt-2 text-sm">{user.profile.bio}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
