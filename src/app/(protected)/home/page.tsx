'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/auth'; // Pastikan path ini benar
import { Page } from '@/components/PageLayout'; // Pastikan path ini benar
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react'; // Pastikan path ini benar
import { FaWallet, FaCopy, FaCheck } from 'react-icons/fa'; // Tambahkan FaCopy dan FaCheck
import { Navigation } from '@/components/Navigation'; // Pastikan path ini benar

// Komponen Tombol Salin yang Ditingkatkan
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
      disabled={copied} // Nonaktifkan tombol saat status "copied" aktif
      className={`
        flex items-center justify-center gap-2 py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out
        ${copied
          ? 'bg-green-500 text-white cursor-default' // Gaya saat berhasil disalin
          : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-md hover:shadow-lg' // Gaya normal
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

export default function Home() {
  const [username, setUsername] = useState<string>(""); // Menyimpan username
  const [session, setSession] = useState<any>(null); // Menyimpan data sesi pengguna
  const [loading, setLoading] = useState<boolean>(true); // Menangani status loading

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Mulai loading
      try {
        const sessionData = await auth(); // Mengambil data sesi pengguna
        setSession(sessionData);
        setUsername(sessionData?.user?.username || "Pengguna"); // Menyimpan username atau default jika tidak ada
      } catch (error) {
        console.error("Error fetching session:", error);
        setUsername("Gagal Memuat"); // Tampilkan pesan error jika tidak bisa mengambil sesi
      } finally {
        setLoading(false); // Selesai loading
      }
    };
    fetchUser(); // Panggil fungsi fetchUser untuk mengambil sesi
  }, []);

  const address = session?.user?.walletAddress || "XDogecoin_Address_Here_1234567890"; // Menggunakan alamat dompet pengguna

  const handleOpenUnoWallet = () => {
    window.location.href = "https://link-ke-uno-wallet.com"; // Tautkan ke halaman Uno Wallet
  };

  return (
    <Page>
      {/* Top Bar dengan styling lebih halus */}
      <Page.Header className="p-0 border-b border-gray-200 dark:border-gray-700">
        <TopBar
          title="Xdoge Home" // Judul lebih deskriptif
          endAdornment={
            <div className="flex items-center gap-2 px-4">
              {loading ? (
                <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                  Halo, {username}!
                </p>
              )}
            </div>
          }
        />
      </Page.Header>

      {/* Konten Utama dengan background gradien dan padding */}
      <Page.Main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 pt-8 pb-24">
        {/* Kontainer utama untuk konten */}
        <div className="w-full max-w-md flex flex-col items-center gap-8">

          {/* Logo dan Nama Pengguna */}
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img
              src="/xdoge-logo.png" // Pastikan path logo benar
              alt="Xdoge Logo"
              className="w-28 h-28 md:w-32 md:h-32 object-contain mb-2 drop-shadow-lg" // Ukuran disesuaikan, tambah shadow
            />
             {loading ? (
                <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div> // Placeholder loading
              ) : (
                <p className="text-white font-semibold text-xl capitalize">{username}</p>
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

          {/* Tombol Open Uno Wallet dengan Gradien dan Efek */}
          <button
            onClick={handleOpenUnoWallet}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaWallet size={20} /> {/* Ukuran ikon disesuaikan */}
            Buka Uno Wallet
          </button>

          {/* Menampilkan Alamat Dompet */}
          <div className="mt-4 text-center w-full">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Alamat Dompet Anda</p>
            <div className="bg-gray-700 text-white p-4 rounded-lg shadow-inner w-full text-center break-words text-sm font-mono relative group">
              <span className="block truncate">{address}</span> {/* Truncate jika terlalu panjang */}
            </div>
          </div>

          {/* Tombol Salin (menggunakan komponen CopyButton yang sudah ditingkatkan) */}
          <div className="mt-2">
             <CopyButton address={address} />
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
