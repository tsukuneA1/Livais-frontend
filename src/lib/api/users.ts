import type { UserProfileProps } from '@/types/profile';

export async function fetchUser(userId: string): Promise<UserProfileProps['user']> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/${userId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user with id: ${userId}`);
  }

  return res.json();
}