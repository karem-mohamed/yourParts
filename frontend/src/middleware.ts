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
    return res;
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en/home', req.url));
  }
  return NextResponse.next();
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
