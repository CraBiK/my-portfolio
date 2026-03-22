import { NextRequest, NextResponse } from 'next/server';
import { decrypt, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/admin');

  if (isProtectedRoute) {
    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await decrypt(cookie);

    // Если нет сессии или роль не админ — на выход
    if (!session || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
