import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, CalendarDays,ChevronLeft,Search,MoreHorizontal } from 'lucide-react';
import type { UserProfileProps } from '@/types/profile.ts';

export const UserProfile = ({ userId,user }: UserProfileProps ) => {
  return (
    <div className='min-h-screen w-full bg-gray-100'>
      <div className="max-w mx-auto relative">
        <div className="flex items-center justify-between px-6 absolute top-33 left-0 right-0 z-10">
          <Button className="rounded-full bg-black/50 p-2">
            <ChevronLeft className="h-5 w-5 text-white" />
          </Button>
          <div className="flex gap-2">
            <Button className="rounded-full bg-black/50 p-2">
              <Search className="h-5 w-5 text-white" />
            </Button>
            <Button className="rounded-full bg-black/50 p-2">
              <MoreHorizontal className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
        <Card className='w-full rounded-none bg-white'>
          <div className='relative h-40 bg-gray-800'>
            <Avatar className='h-50 w-full rounded-none '>
              <AvatarImage src={user.cover_image || "/placeholder.svg"} alt={user.name} className='absolute top-10 left-0 right-0 z-10'/>
              <AvatarFallback className='rounded-none'>
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <Avatar className='-bottom-28 absolute left-4 size-23 border-6 border-white'>
              <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <CardContent className='mt-4 pt-4 px-10'>
            <div className='mb-4 flex items-center justify-end'>
              <div className='flex gap-4'>
                <Button variant='outline' size="icon" className="rounded-full bg-transparent border-gray-600 hover:bg-gray-200">
                  <Mail className="h-5 w-5" />
                </Button>
                <Button className="rounded-full bg-black text-white hover:bg-gray-200 px-15 min-w-24">フォローする</Button>
              </div>
            </div>
            <h2 className='font-bold text-2xl '>{user.name}</h2>
            <p className='text-gray-500'>@{user.username}</p>
            <p className='mt-2'>{user.bio}</p>

            <p className='mt-2 flex text-gray-500'>
              <CalendarDays className='mr-2' />
              {user.joinDate}からXを利用しています
            </p>
            <div className='mt-2 flex gap-4 text-gray-700'>
              <span>{user.followCount} フォロー中</span>
              <span>{user.followerCount} フォロワー</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
