import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If not authenticated, redirect to login
  if (!session) {
    redirect('/login?redirect=/admin');
  }

  // Check admin role - industry best practice: server-side role verification
  // Note: Middleware also checks this, but we verify here as defense in depth
  const userMetadata = session.user.user_metadata as { role?: string } | undefined;

  if (userMetadata?.role !== 'admin') {
    // Redirect to 403 page - middleware should have caught this, but this is a backup
    redirect('/403');
  }

  return <AdminDashboardClient />;
}
