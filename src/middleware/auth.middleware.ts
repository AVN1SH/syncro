import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from "next-auth/middleware";

export async function middleware(request : NextRequest) {

  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const pathname = url.pathname;

  if(token && (
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if(!token && (
    pathname.startsWith('/dashboard')
  )) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher : [
    '/sign-in',
    "/sign-up",
    '/',
    "/dashboard/:path*"
  ]
}