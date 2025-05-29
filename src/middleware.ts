import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const cookiesStore = request.cookies;
  const sessionId = cookiesStore.get('sessionId')?.value;
  const userId = cookiesStore.get('userId')?.value;

  if (request.nextUrl.pathname.startsWith('/login')) {
    const canLogout = JSON.parse(request.nextUrl.searchParams.get('logout') ?? 'false');
    if (canLogout && sessionId && userId) {
      const response = NextResponse.redirect(new URL('/login', request.url));

      response.cookies.delete('sessionId');
      response.cookies.delete('userId');

      return response;
    }

    if (sessionId && userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
