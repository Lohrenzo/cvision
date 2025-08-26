// import NextAuth from "next-auth";
// import authConfig from "@/auth.config";
// import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//     const { nextUrl } = req;
//     const isLoggedIn = !!req.auth
//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//     const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//     const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//     // console.log("ROUTE: ", req.nextUrl.pathname)
//     // console.log("IS_LOGGED_IN: ", isLoggedIn)
//     // console.log("AUTH: ", req.auth)
//     if (isApiAuthRoute) return null


//     if (isAuthRoute) {
//         if (isLoggedIn) {
//             // Redirect logged-in users away from auth routes
//             return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//         }
//         return null; // Allow access to auth routes
//     }

//     if (!isLoggedIn && !isPublicRoute) {
//         // Redirect unauthenticated users to login
//         return Response.redirect(new URL("/auth/login", nextUrl));
//     }
//     return null; // Allow access to public routes
// })

// export const config = {
//     matcher: [
//         // "/",              // protect homepage
//         // "/dashboard/:path*",
//         // "/profile/:path*",
//         // "/settings/:path*",
//         // "/auth/login",    // handle login redirect logic
//         // "/auth/signup",
//         // Skip Next.js internals and all static files, unless found in search params
//         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//         // Always run for API routes
//         // '/(api|trpc)(.*)',
//     ],
//     // unstable_allowDynamic: [
//     //     // allows a single file
//     //     '/lib/utilities.js',
//     //     '/lib/database.js',
//     // ],
//     // runtime: "nodejs", // ensure Node.js runtime for auth
// };

// export { auth as middleware } from "@/auth"

// export const config = {
//     matcher: [
//         '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
//     ],
// }

// middleware.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    // Public routes
    const publicPaths = ["/auth/signin", "/auth/signup", "/auth/error"]

    // If user is not logged in and trying to access a protected route → redirect
    if (!isLoggedIn && !publicPaths.includes(nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Otherwise, continue
    return NextResponse.next()
})

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
    ],
}
