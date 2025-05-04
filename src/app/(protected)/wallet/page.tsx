'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Page } from '@/components/PageLayout'; // Asumsi path benar
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import { FaWallet, FaCopy, FaCheck, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Navigation } from '@/components/Navigation';
import QRCode from 'react-qr-code'; // Library untuk QR Code
import Image from 'next/image';  // Import Image dari next/image
import { auth } from '@/auth';  // Pastikan path ke file auth benar


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
      className={`flex items-center justify-center gap-2 w-full sm:w-auto py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out mt-3 ${copied ? 'bg-green-500 text-white cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-md hover:shadow-lg'}`}
    >
      {copied ? (
        <> <FaCheck /> Disalin! </>
      ) : (
        <> <FaCopy /> Salin Alamat </>
      )}
    </button>
  );
};

export default function Wallet() {
  const [userData, setUserData] = useState<{ username: string | null; address: string | null; balance: number | null }>({
    username: null,
    address: null,
    balance: null,
  });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'main' | 'send' | 'receive'>('main'); // Kontrol tampilan (main, send, receive)

  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState<number | string>(''); 
  const [sending, setSending] = useState(false); 
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);


  useEffect(() => {
    // Fetch data from the blockchain (provider, balance, etc.)
    const fetchUserData = async () => {
      try {
        const sessionData = await auth();  // Mengambil data sesi
        console.log("Session Data:", sessionData);  // Debugging untuk memastikan data yang diterima

        // Menyimpan data user setelah auth berhasil
        setUserData({
          username: sessionData?.user?.username || 'Pengguna Tanpa Nama',  // Menggunakan username dari sesi
          address: sessionData?.user?.walletAddress || 'Alamat Dompet Tidak Tersedia',  // Menggunakan address dari sesi
          balance: 0,  // Gantikan dengan data saldo dari blockchain atau API
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dimuat

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientAddress || !sendAmount || Number(sendAmount) <= 0) {
      setSendError("Harap isi alamat penerima dan jumlah yang valid.");
      return;
    }

    // Cek jika saldo mencukupi
    if (userData.balance !== null && !isNaN(Number(sendAmount)) && Number(sendAmount) > userData.balance) {
      setSendError("Saldo tidak mencukupi.");
      return;
    }

    setSending(true);
    setSendError(null);
    setSendSuccess(null);
    console.log(`Mengirim ${sendAmount} XDOGE ke ${recipientAddress}`);

    // Simulasi pengiriman dengan setTimeout
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.2;
    if (success) {
      setSendSuccess(`Berhasil mengirim ${sendAmount} XDOGE ke ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}`);
      setRecipientAddress('');
      setSendAmount('');
    } else {
      setSendError("Pengiriman gagal. Silakan coba lagi.");
    }

    setSending(false);
  };

  const formatBalance = (balance: number | null): string => {
    if (loading) return "Memuat...";
    if (balance === null) return "N/A";
    return balance.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Page>
      <Page.Header className="p-0 border-b border-gray-700">
        <TopBar
          title="Xdoge Wallet"
          endAdornment={
            <div className="flex items-center gap-2 px-4">
              {loading ? (
                <span className="text-sm text-gray-400 animate-pulse">Memuat...</span>
              ) : (
                <p className="text-sm font-medium text-gray-200 capitalize">{userData.username || "Pengguna"}</p>
              )}
            </div>
          }
        />
      </Page.Header>

      <Page.Main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 pt-6 pb-24">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          {/* Menggunakan Image dari next/image */}
          <Image src="/xdoge-logo.png" alt="Xdoge Logo" width={80} height={80} className="mb-0 drop-shadow-lg" />

          <div className="text-center text-white">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Saldo Anda</p>
            <p className={`text-4xl font-bold mt-1 ${loading ? 'animate-pulse text-gray-600' : 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500'}`} >
              {formatBalance(userData.balance)}
              {!loading && <span className="text-2xl ml-1 text-gray-400 font-medium">XDOGE</span>}
            </p>
          </div>

          <div className="flex w-full gap-4 mt-2">
            <button
              onClick={() => setActiveView(activeView === 'send' ? 'main' : 'send')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 font-semibold text-lg ${activeView === 'send' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
            >
              <FaArrowUp /> Kirim
            </button>
            <button
              onClick={() => setActiveView(activeView === 'receive' ? 'main' : 'receive')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 font-semibold text-lg ${activeView === 'receive' ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
            >
              <FaArrowDown /> Terima
            </button>
          </div>

          {activeView === 'send' && (
            <div className="w-full mt-4 p-5 bg-gray-800 rounded-xl shadow-lg animate-fade-in">
              <h2 className="text-xl font-semibold text-white mb-4 text-center border-b border-gray-700 pb-2">Kirim XDOGE</h2>
              <form onSubmit={handleSendSubmit} className="space-y-4">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">Alamat Penerima</label>
                  <input
                    type="text"
                    id="recipient"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Masukkan alamat penerima"
                    required
                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Jumlah</label>
                  <input
                    type="number"
                    id="amount"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    min="0.000001"
                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400">XDOGE</span>
                </div>

                {sendError && <p className="text-sm text-red-400 bg-red-900/30 p-2 rounded-md text-center">{sendError}</p>}
                {sendSuccess && <p className="text-sm text-green-400 bg-green-900/30 p-2 rounded-md text-center">{sendSuccess}</p>}

                <button
                  type="submit"
                  disabled={sending || loading}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-lg text-white ${sending ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-pink-500 hover:bg-pink-600 shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-400'}`}
                >
                  {sending ? 'Mengirim...' : <><FaArrowUp /> Kirim Sekarang</>}
                </button>
              </form>
            </div>
          )}

          {activeView === 'receive' && (
            <div className="w-full mt-4 p-5 bg-gray-800 rounded-xl shadow-lg animate-fade-in">
              <h2 className="text-xl font-semibold text-white mb-4 text-center border-b border-gray-700 pb-2">Terima XDOGE</h2>
              <QRCode value={userData.address || ''} size={160} level="M" fgColor="#000000" bgColor="#FFFFFF" />
              <div className="text-sm text-gray-400 mt-4 mb-2">Alamat Dompet Anda</div>
              <div className="bg-gray-700 text-white p-3 rounded-lg text-center font-mono">
                {userData.address || "Alamat tidak tersedia"}
              </div>
              <CopyButton address={userData.address || ''} />
            </div>
          )}

          {activeView === 'main' && (
            <div className="text-center text-gray-500 mt-6 text-sm">
              Pilih "Kirim" untuk mengirim XDOGE atau "Terima" untuk melihat alamat Anda.
            </div>
          )}

        </div>
      </Page.Main>

      <Page.Footer className="px-0 fixed bottom-0 w-full bg-gray-800 border-t border-gray-700 shadow-md z-50">
        <Navigation />
      </Page.Footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </Page>
  );
}
