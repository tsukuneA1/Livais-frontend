import { Post } from '@/components/general/post/post';
import { MainLayout } from '@/layouts/main/layout';
import type { Post as posttype } from '@/types/post';
import { UserProfile } from '@/components/domain/userprofile';
import { mockUser } from '@/const/mockUser';
import { fetchUser } from '@/lib/api/user';
import { fetchUserPosts } from '@/lib/api/posts';

type Props = {
	params: {
		id: string;
	};
}
export default async function Page({ params }: Props) {
	const userid = params.id;
  const user = await fetchUser(userid);
  const posts = await fetchUserPosts(userid);

  return (
  <MainLayout>
    <UserProfile {...mockUser} />
    {/* {posts.map((post) => (
      <Post key={uuidv4()} post={post} />
    ))} */}
  </MainLayout>
);
}
