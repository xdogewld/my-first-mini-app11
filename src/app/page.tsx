'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Gunakan useRouter dari next/navigation
import { auth } from '@/auth'; // Pastikan auth mengembalikan session yang benar
import { Page } from '@/components/PageLayout';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import { AuthButton } from '@/components/AuthButton';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);  // Add state to check if it's running on client
  const router = useRouter(); // Inisialisasi useRouter

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await auth(); // Ambil session pengguna
        setSession(sessionData);
        if (sessionData) {
          router.push('/home/page.tsx'); // Jika sudah login, arahkan ke halaman wallet
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    // Check if it's client-side
    if (typeof window !== "undefined") {
      setIsClient(true); // Ensure the app is running in the client
      fetchSession();
    }
  }, [router]);

  if (!isClient) {
    return <div>Loading...</div>;  // Loading message until we know it's client-side
  }

  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] p-4">
        <div className="text-center">
          <img
            className="logo mx-auto w-24 h-auto mb-6"
            src="/xdoge-logo.png"
            alt="Xdoge Logo"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/96x96/0a0a0a/ffffff?text=Logo';
              e.currentTarget.onerror = null;
            }}
          />
          <h1 className="text-white text-5xl font-bold mb-3">
            Xdoge App
          </h1>
          <p className="text-neutral-300 text-lg mt-2">
            Xdoge Meme on Worldchain
          </p>
          <div className="mt-8">
            {loading ? (
              <p className="text-white">Memuat...</p>
            ) : (
              <AuthButton />
            )}
          </div>
        </div>
      </Page.Main>
    </Page>
  );
}
