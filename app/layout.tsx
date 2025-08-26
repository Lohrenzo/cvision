import type { Metadata } from "next";
import { Inter, Gabriela } from "next/font/google";
// import { GeistSans } from 'geist/font/sans'
// import { GeistMono } from 'geist/font/mono'
import "./globals.css";
import { auth } from "@/auth";
import NavBar from "@/components/nav-bar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });
const gabriela = Gabriela({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CVision",
  description: "See beyond the resumé.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`absolute ${gabriela.className} ${inter.className} relative antialiased min-h-screen bg-gradient-to-br from-gray-900 to-gray-900`}
      >
        <Providers>
          {session?.user && <NavBar />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
