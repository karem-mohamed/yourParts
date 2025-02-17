import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';
import { NextRequest, NextResponse } from 'next/server';
import { messages } from './messages';

export function middleware(req: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  const res = handleI18nRouting(req);
  const { pathname } = req.nextUrl;
  const locale = pathname.split('/')[1];
  if (locale in messages) {
    res.cookies.set('locale', locale);
    const allowedRoutes = [
      `/${locale}/login`,
      `/${locale}/register`,
      `/${locale}/reset`,
      `/${locale}/home`,
      `/${locale}/myposts`,
      `/${locale}/categories`,
      `/${locale}/tags`,
    ];
    const userLocale = locale in messages ? locale : 'en';
    if (!allowedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL(`/${userLocale}/login`, req.url));
    }
  }

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/en/home', req.url));
  }
  return res;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
