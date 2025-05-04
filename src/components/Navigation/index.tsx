'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Bank, Home, User } from 'iconoir-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Pastikan menggunakan useRouter

export const Navigation = () => {
  const [value, setValue] = useState('home');
  const router = useRouter(); // Inisialisasi router untuk navigasi

  // Fungsi untuk menangani perubahan tab dan melakukan navigasi
  const handleTabChange = (newValue: string) => {
    setValue(newValue);
    
    if (newValue === 'home') {
      router.push('/home'); // Arahkan ke halaman Home
    } else if (newValue === 'wallet') {
      router.push('/wallet'); // Arahkan ke halaman Wallet
    } else if (newValue === 'profile') {
      router.push('/profile'); // Arahkan ke halaman Profile
    }
  };

  return (
    <Tabs value={value} onValueChange={handleTabChange}>
      <TabItem value="home" icon={<Home />} label="Home" />
      <TabItem value="wallet" icon={<Bank />} label="Wallet" />
      <TabItem value="profile" icon={<User />} label="Profile" />
    </Tabs>
  );
};
