import { auth } from '@/auth';
import { Navigation } from '@/components/Navigation';
import { Page } from '@/components/PageLayout';
import { redirect } from 'next/navigation'; // Pastikan ini diimpor

export default async function TabsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    // Jika pengguna tidak terautentikasi, arahkan ke halaman login
    redirect('/');
  }

  return (
    <Page>
      {children}
      <Page.Footer className="px-0 fixed bottom-0 w-full bg-white">
        <Navigation />
      </Page.Footer>
    </Page>
  );
}
