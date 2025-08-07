import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tokenRes = await fetch('https://identity.tyo1.conoha.io/v3/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth: {
          identity: {
            methods: ['password'],
            password: {
              user: {
                name: 'gncu17040839',
                password: 'Intern2025-TeamB',
                domain: { id: 'default' }
              }
            }
          },
          scope: { project: { id: 'fd15a7a690564e77a8d86b4bf9132e9f' } }
        }
      })
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      return NextResponse.json({ error: 'トークン取得失敗', detail: errorText }, { status: 500 });
    }

    const token = tokenRes.headers.get('X-Subject-Token');
    if (!token) {
      return NextResponse.json({ error: 'トークンが取得できませんでした' }, { status: 500 });
    }

    const userRes = await fetch('https://identity.tyo1.conoha.io/v3/users/57f2f34da99b4d1688edca8fb67b1140', {
      headers: { 'X-Auth-Token': token }
    });

    if (!userRes.ok) {
      const errorText = await userRes.text();
      return NextResponse.json({ error: 'ユーザー情報取得失敗', detail: errorText }, { status: 500 });
    }

    const userData = await userRes.json();
    return NextResponse.json(userData.user);
  } catch (err: unknown) {
    return NextResponse.json({ error: 'サーバーエラー', detail: err.message }, { status: 500 });
  }
}