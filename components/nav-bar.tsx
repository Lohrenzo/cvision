import { auth } from "@/auth";
import { Brain } from "lucide-react";
import UserAvatar from "./auth/userAvatar";
import Link from "next/link";

export default async function NavBar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <nav className="sticky top-0 w-full z-50 border-b border-gray-800/50 bg-black/40 backdrop-blur">
      <div className="flex justify-between items-center container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500"
          >
            <Brain className="h-6 w-6 text-white" />
          </Link>
          <div>
            <Link href="/" className="text-2xl font-bold text-white">
              AI CV Analyst
            </Link>
            <p className="text-gray-400">Advanced CV analysis powered by AI</p>
          </div>
        </div>
        <UserAvatar session={session} />
      </div>
    </nav>
  );
}
