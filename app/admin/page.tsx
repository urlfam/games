import { getAllGames } from '@/lib/games';
import AdminDashboardClient from './AdminDashboardClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const cookieStore = cookies()
  const hasSession = cookieStore.get('admin_session')
  
  if (!hasSession) {
    redirect('/admin/login')
  }

  const games = await getAllGames();
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <AdminDashboardClient games={games} />
    </div>
  );
}
