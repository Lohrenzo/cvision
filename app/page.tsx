"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.replace("/home");
    }
  }, [session, status, router]);

  if (status === "loading" || session) {
    return null;
  }

  return (
    <main className="flex flex-col items-center px-3 justify-center min-h-[90vh]">
      <div className="text-center p-8 rounded-lg shadow-lg border-gray-800/50 bg-black/40 backdrop-blur">
        <img
          src="/cvision-logo.png"
          alt="CVision Logo"
          className="mx-auto mb-6 w-24 h-24 rounded-lg"
        />
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to CVision
        </h1>
        <p className="text-lg text-gray-400 mb-6">
          Your AI-powered platform for CV analysis, comparison, and rewriting.
          Upload your CV and unlock insights to boost your career!
        </p>
        <Link
          href="/auth/signin"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
