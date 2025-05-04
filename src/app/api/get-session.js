// app/api/get-session/route.js
export async function GET() {
    // Ambil session dari autentikasi atau token yang disimpan
    const session = {
      user: {
        username: 'user123',
        profilePictureUrl: '/path-to-profile-picture.jpg'
      }
    };
    return new Response(JSON.stringify(session), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  