import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protect all routes except /login and static assets
  if (!token && !pathname.startsWith('/login') && !pathname.startsWith('/_next') && !pathname.startsWith('/favicon.ico')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to /products if logged in and accessing / or /login
  if (token && (pathname === '/' || pathname.startsWith('/login'))) {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
