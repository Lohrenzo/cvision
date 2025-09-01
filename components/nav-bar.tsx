import { auth } from "@/auth";
import { Binoculars } from "lucide-react";
import UserAvatar from "./auth/userAvatar";
import Link from "next/link";
import Image from "next/image";

export default async function NavBar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <nav className="sticky top-0 w-full z-50 border-b border-gray-800/50 bg-black/40 backdrop-blur">
      <div className="flex justify-between items-center container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-700"
          >
            {/* <Binoculars className="h-6 w-6 text-white" /> */}
            <Image
              src="/cvision-logo.png"
              width={10}
              height={10}
              alt="CVision Logo"
              className="h-11 w-11 text-white rounded-lg"
            />
          </Link>
          <div>
            <Link href="/home" className="text-2xl font-bold text-white">
              CVision
            </Link>
            <p className="text-gray-400">See beyond the resumé</p>
          </div>
        </div>
        <UserAvatar session={session} />
      </div>
    </nav>
  );
}
