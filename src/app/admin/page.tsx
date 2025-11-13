import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login?redirect=/admin');
  }

  const userMetadata = session.user.user_metadata as { role?: string } | undefined;

  if (userMetadata?.role !== 'admin') {
    redirect('/');
  }

  return <AdminDashboardClient />;
}
