'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/auth'; // Pastikan path ini benar dan auth() bisa dipanggil dari client
import { Page } from '@/components/PageLayout'; // Pastikan path ini benar
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react'; // Pastikan path ini benar
import { FaWallet, FaCopy, FaCheck } from 'react-icons/fa'; // Import ikon
import { Navigation } from '@/components/Navigation'; // Pastikan path ini benar

// Komponen CopyButton (tidak diubah, sudah bagus)
const CopyButton = ({ address }: { address: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset status copied setelah 2 detik
      })
      .catch(err => {
        console.error("Gagal menyalin alamat dompet", err);
      });
  };

  return (
    <button
      onClick={handleCopy}
      disabled={copied}
      className={`
        flex items-center justify-center gap-2 py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out
        ${copied
          ? 'bg-green-500 text-white cursor-default'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-md hover:shadow-lg'
        }
      `}
    >
      {copied ? (
        <><FaCheck /> Disalin!</>
      ) : (
        <><FaCopy /> Salin Alamat</>
      )}
    </button>
  );
};

// Komponen Halaman Utama
export default function Home() {
  const [username, setUsername] = useState<string>(""); // Menyimpan username
  const [session, setSession] = useState<any>(null); // Menyimpan data sesi pengguna
  const [loading, setLoading] = useState<boolean>(true); // Menangani status loading
  const [walletAddress, setWalletAddress] = useState<string>("Alamat_Dompet_Tidak_Tersedia"); // Menyimpan alamat dompet
  const router = useRouter(); // Inisialisasi useRouter (jika digunakan nanti)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Penting: Pastikan auth() aman dan bisa dipanggil dari client-side.
        // Jika auth() hanya untuk server, Anda perlu strategi fetching data yang berbeda
        // (misalnya, melalui API route atau Server Component parent).
        const sessionData = await auth();
        console.log("Session Data:", sessionData);

        if (!sessionData?.user) { // Cek spesifik ke sessionData.user
          console.log("Tidak ada data user di sesi");
          setUsername("Pengguna Tamu"); // Atau teks lain yang sesuai
          setSession(null);
          setWalletAddress("Alamat_Dompet_Tidak_Tersedia");
        } else {
          setSession(sessionData);
          setUsername(sessionData.user.username || "Pengguna Tanpa Nama");
          setWalletAddress(sessionData.user.walletAddress || "Alamat_Dompet_Tidak_Tersedia");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setUsername("Gagal Memuat");
        setSession(null);
        setWalletAddress("Alamat_Dompet_Tidak_Tersedia");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // UseEffect hanya dipanggil sekali

  const handleOpenUnoWallet = () => {
    // Pastikan URL ini benar
    window.location.href = "https://link-ke-uno-wallet.com";
  };

  return (
    <Page>
      {/* Top Bar */}
      <Page.Header className="p-0 border-b border-gray-200 dark:border-gray-700">
        <TopBar
          title="Xdoge Home"
          endAdornment={
            <div className="flex items-center gap-2 px-4">
              {loading ? (
                <span className="text-sm text-gray-500 animate-pulse">Memuat...</span>
              ) : (
                // === USERNAME DI TOP BAR ===
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize truncate" title={username}>
                  {/* Tampilkan username langsung atau dengan sapaan */}
                  {username === "Gagal Memuat" || username === "Pengguna Tamu" ? username : `Halo, ${username}!`}
                </p>
              )}
            </div>
          }
        />
      </Page.Header>

      {/* Konten Utama */}
      <Page.Main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 pt-8 pb-24">
        <div className="w-full max-w-md flex flex-col items-center gap-8">

          {/* Logo dan Nama Pengguna */}
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img
              src="/xdoge-logo.png" // Pastikan path logo benar
              alt="Xdoge Logo"
              className="w-28 h-28 md:w-32 md:h-32 object-contain mb-2 drop-shadow-lg"
            />
            {loading ? (
              <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div> // Placeholder loading
            ) : (
              // === USERNAME DI BAWAH LOGO ===
              <p className="text-white font-semibold text-xl capitalize" title={username}>
                {username}
              </p>
            )}
          </div>

          {/* Info Teks */}
          <div className="text-center text-white px-4">
            <h1 className="font-bold text-2xl md:text-3xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Dompet Xdoge Anda
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Kelola dan tukarkan token Xdoge Anda dengan aman dan cepat.
            </p>
          </div>

          {/* Tombol Open Uno Wallet */}
          <button
            onClick={handleOpenUnoWallet}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaWallet size={20} />
            Buka Uno Wallet
          </button>

          {/* Menampilkan Alamat Dompet */}
          <div className="mt-4 text-center w-full">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Alamat Dompet Anda</p>
            <div className="bg-gray-700 text-white p-4 rounded-lg shadow-inner w-full text-center break-words text-sm font-mono relative group">
              <span className="block truncate">{walletAddress}</span>
            </div>
          </div>

          {/* Tombol Salin */}
          <div className="mt-2">
             <CopyButton address={walletAddress} />
          </div>
        </div>
      </Page.Main>

      {/* Navigasi di Footer */}
      <Page.Footer className="px-0 fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md z-50">
         <Navigation />
      </Page.Footer>
    </Page>
  );
}
