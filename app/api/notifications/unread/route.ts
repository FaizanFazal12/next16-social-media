import { NextResponse } from 'next/server';
import { getUnreadNotificationCount } from '@/features/notifications/notifications-queries';

export async function GET() {
  return NextResponse.json(await getUnreadNotificationCount());
}
