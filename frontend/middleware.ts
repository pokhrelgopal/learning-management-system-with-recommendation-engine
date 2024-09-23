import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";

interface DecodedToken {
  exp: number;
  user_id: string;
  role: string;
}

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
  };
}

export function middleware(req: AuthenticatedRequest) {
  const access = req.cookies.get("access")?.value;
  let isLoggedIn = false;
  let role = "";

  try {
    if (access) {
      const decodedToken = jwtDecode<DecodedToken>(access);
      const { exp, user_id, role: userRole } = decodedToken;
      const timeNow = Math.floor(Date.now() / 1000);

      if (exp > timeNow) {
        isLoggedIn = true;
        req.user = {
          id: user_id,
          role: userRole,
        };
        role = userRole;

        if (
          isLoggedIn &&
          role !== "admin" &&
          req.nextUrl.pathname.startsWith("/admin")
        ) {
          return NextResponse.rewrite(new URL("/", req.url));
        }

        if (
          isLoggedIn &&
          role !== "instructor" &&
          req.nextUrl.pathname.startsWith("/instructor")
        ) {
          return NextResponse.rewrite(new URL("/", req.url));
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  if (
    isLoggedIn &&
    role == "admin" &&
    (req.nextUrl.pathname.endsWith("/courses") ||
      req.nextUrl.pathname.endsWith("/my-courses"))
  ) {
    return NextResponse.rewrite(new URL("/admin", req.url));
  }

  if (
    isLoggedIn &&
    (req.nextUrl.pathname.includes("/login") ||
      req.nextUrl.pathname.includes("/register"))
  ) {
    return NextResponse.rewrite(new URL("/", req.url));
  }
  if (
    !isLoggedIn &&
    (req.nextUrl.pathname.includes("/profile") ||
      req.nextUrl.pathname.includes("/my-courses") ||
      req.nextUrl.pathname.includes("/profile/courses") ||
      req.nextUrl.pathname.includes("/admin") ||
      // req.nextUrl.pathname.includes("/certificate") ||
      req.nextUrl.pathname.includes("/checkout") ||
      req.nextUrl.pathname.includes("/payment-success") ||
      req.nextUrl.pathname.includes("/instructor") ||
      req.nextUrl.pathname.includes("/instructor/courses"))
  ) {
    return NextResponse.rewrite(new URL("/login", req.url));
  }
}
