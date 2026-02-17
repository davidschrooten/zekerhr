import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest } from 'next/server';
 
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  
  // Update session on the response
  return await updateSession(request, response);
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(nl|en)/:path*']
};
