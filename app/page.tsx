"use client";
import type React from "react";
import { useSession } from "next-auth/react";

import FeatureCards from "@/components/feature-cards";
import CVAnalysisForm from "@/components/cv-analysis-form";
import Loading from "@/components/loading";

export default function CVAnalyzer() {
  const { status } = useSession();

  // useEffect(() => {
  //   toast("Welcome To Your Personal AI Powered CV Analyst", {
  //     icon: "👋🏽",
  //   });
  // }, []);

  if (status === "loading") <Loading />;

  // if (!session?.user) redirect("/auth/signin");

  return (
    <div className="">
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Analyze Your CV with{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Precision
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get detailed insights on how well your CV matches job requirements
              with our advanced AI powered analysis
            </p>
          </div>
          {/* Feature Cards */}
          <FeatureCards />

          {/* CV Analysis Form */}
          <CVAnalysisForm />
        </div>
      </div>
    </div>
  );
}
