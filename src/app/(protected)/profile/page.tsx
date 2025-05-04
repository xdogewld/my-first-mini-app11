'use client';

import React, { useState, useEffect } from 'react';
import { Page } from '@/components/PageLayout'; // Asumsi path benar
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react'; // Asumsi path benar
import { FaCopy, FaCheck, FaUserCircle } from 'react-icons/fa'; // Ikon untuk profil dan salin
import { Navigation } from '@/components/Navigation'; // Asumsi path benar

// --- Komponen Tombol Salin (Sama seperti di Wallet, bisa diimport jika sudah jadi komponen terpisah) ---
const CopyButton = ({ address }: { address: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
        flex items-center justify-center gap-2 w-full sm:w-auto
        py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out mt-3
        ${copied
          ? 'bg-green-500 text-white cursor-default'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-md hover:shadow-lg'
        }
      `}
    >
      {copied ? (
        <> <FaCheck /> Disalin! </>
      ) : (
        <> <FaCopy /> Salin Alamat </>
      )}
    </button>
  );
};


// --- Komponen Utama Profile ---
export default function Profile() {
  // --- State ---
  const [userData, setUserData] = useState<{ username: string | null; address: string | null }>({
    username: null,
    address: null,
  });
  const [loading, setLoading] = useState(true);

  // --- Effects ---
  useEffect(() => {
    // Simulasi pengambilan data profil pengguna
    setLoading(true);
    setTimeout(() => { // Ganti dengan fetch API sesungguhnya
      setUserData({
        username: "JohnDoe", // Ganti dengan data asli dari session atau API
        address: "XDogecoin_Address_Here_1234567890", // Ganti dengan data asli
      });
      setLoading(false);
    }, 1000); // Delay simulasi
  }, []);


  // --- Render ---
  return (
    <Page>
      {/* --- Header --- */}
      <Page.Header className="p-0 border-b border-gray-700">
        <TopBar title="Profil Pengguna" />
        {/* endAdornment bisa ditambahkan jika perlu, misal tombol logout */}
      </Page.Header>

      {/* --- Konten Utama --- */}
      <Page.Main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 pt-8 pb-24">
         {/* Kontainer utama untuk konten */}
         <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">

           {/* --- Ikon Profil --- */}
           <FaUserCircle className={`text-gray-500 ${loading ? 'opacity-50' : 'text-white'} text-7xl mb-2`} />

           {/* --- Nama Pengguna --- */}
           <div className="w-full">
                <h1 className="text-2xl font-bold text-white capitalize mb-1">
                {loading ? (
                    <span className="inline-block h-7 w-3/4 bg-gray-700 rounded animate-pulse"></span>
                ) : (
                    userData.username || "Nama Pengguna"
                )}
                </h1>
                <p className="text-sm text-gray-400">Profil Pengguna</p>
           </div>


           {/* --- Alamat Dompet --- */}
           <div className="w-full mt-4 text-center">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Alamat Dompet Anda</p>
                <div className={`bg-gray-700 text-white p-3 rounded-lg shadow-inner w-full text-center break-words text-sm font-mono mb-2 min-h-[44px] flex items-center justify-center ${loading ? 'animate-pulse' : ''}`}>
                {loading ? (
                     <span className="inline-block h-4 w-full bg-gray-600 rounded"></span>
                ) : (
                    userData.address || "Alamat tidak tersedia"
                )}
                </div>

                {/* Tombol Salin (hanya tampil jika alamat ada dan tidak loading) */}
                {!loading && userData.address && <CopyButton address={userData.address} />}
            </div>

            {/* --- Informasi Tambahan (Contoh) --- */}
            {/*
            <div className="w-full mt-4 text-left border-t border-gray-700 pt-4">
                <p className="text-sm text-gray-400"><span className="font-medium text-gray-200">Email:</span> {loading ? '...' : 'johndoe@email.com'}</p>
                <p className="text-sm text-gray-400"><span className="font-medium text-gray-200">Bergabung:</span> {loading ? '...' : '01 Mei 2025'}</p>
                 // Tambahkan data profil lain jika ada
            </div>
            */}


         </div>
      </Page.Main>

      {/* --- Navigasi Footer --- */}
      <Page.Footer className="px-0 fixed bottom-0 w-full bg-gray-800 border-t border-gray-700 shadow-md z-50">
         <Navigation />
      </Page.Footer>
    </Page>
  );
}