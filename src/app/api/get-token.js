// server/api/get-token.js
export async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { username, amount } = req.body;
        
        // Logika untuk memberikan token Xdoge ke alamat wallet pengguna
        // Misalnya, kita menggunakan sebuah sistem atau smart contract untuk transaksi
        // Contoh: sendXdogeToUser(username, amount);
  
        // Misalnya berhasil
        res.status(200).json({ message: `Successfully sent ${amount} Xdoge to ${username}.` });
      } catch (error) {
        res.status(500).json({ message: 'Failed to get token Xdoge. Please try again.' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  