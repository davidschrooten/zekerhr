import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest, response: NextResponse) {
  // Create Supabase client using the existing response to handle cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes logic
  // We need to be locale-aware or just check if it's a protected path.
  // Paths are like /en/dashboard, /nl/dashboard.
  // Auth paths are /en/auth/login, /en/auth/sign-up.
  
  const pathname = request.nextUrl.pathname;
  
  // Simple check: if it contains /dashboard/ and no user, redirect to login.
  // We should respect the current locale if possible.
  
  // However, next-intl middleware already handled the locale and returned a response (rewrite or redirect).
  // If `response` is a redirect, we probably shouldn't mess with it unless we want to intercept.
  
  if (response.status === 307 || response.status === 308) {
      return response;
  }

  // If user is NOT logged in and trying to access a protected route
  // The original proxy.ts logic was:
  // if path != "/" && !user && !path.startsWith("/login") && !path.startsWith("/auth")
  
  // Now path might be /en/...
  // We can check if path contains "/dashboard" or similar protected roots.
  // Or we can rely on Layout/Page checks (which I saw earlier in DashboardLayout and DashboardPage).
  
  // The DashboardLayout ALREADY checks for user and redirects.
  // So strictly speaking, we might not NEED to redirect in middleware, 
  // but it's good for performance (prevent rendering server components).
  
  // Let's keep it simple: just refresh session (which sets cookies on `response`).
  // And let Layouts handle auth redirects for now, to avoid complex locale parsing here.
  // OR, if we really want to, we can parse locale.

  return response;
}
