import { NextResponse } from "next/server";
// export function middleware(req: NextRequest) {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     const protectRoutes = ["/home",'/invite'];
//     const authRoutes = ["/register",];

//     if (protectRoutes.some((route) => req.nextUrl.pathname.startsWith(route) && !accessToken)) {

//         return NextResponse.redirect(new URL("/register", req.url));
//     }

//     if (authRoutes.some((route) => req.nextUrl.pathname.startsWith(route) && accessToken)) {
//         return NextResponse.redirect(new URL("/home", req.url));
//     }
//     return NextResponse.next();
// }

// export const config={
//     matcher: ['/login','/register','/home/:path*','/invite/:path*']
// }



export function middleware() {
    // console.log("Middleware Path:", req.nextUrl.pathname);
    // console.log("Cookies:", req.cookies.get("accessToken")?.value);
    return NextResponse.next();
  }