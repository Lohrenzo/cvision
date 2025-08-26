import type { Metadata } from "next";

import { Inter, Gabriela } from "next/font/google";
// import { GeistSans } from 'geist/font/sans'
// import { GeistMono } from 'geist/font/mono'
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/nav-bar";

const inter = Inter({ subsets: ["latin"] });
const gabriela = Gabriela({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI CV Analyst",
  description:
    "AI CV Analyst is a web application that uses AI to analyze and provide feedback on CVs.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  // console.log("Session in layout:", session);

  return (
    <html
      lang="en"
      // className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <SessionProvider>
        <body
          className={`absolute ${gabriela.className} ${inter.className} relative antialiased min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900`}
        >
          {/* check if the url is signin or signup */}
          {session?.user && <NavBar />}
          {children}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              // Define default options
              className: "",
              duration: 5000,
              removeDelay: 1000,
              style: {
                background: "#000e33ff",
                color: "#b4b4b4ff",
              },

              // Default options for specific types
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          />
        </body>
      </SessionProvider>
    </html>
  );
}
