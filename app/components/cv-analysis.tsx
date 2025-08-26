"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  Star,
  Brain,
} from "lucide-react";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { CVComparison } from "./cv-comparison";
import toast from "react-hot-toast";

/**
 * Analysis result structure from the API
 */
interface AnalysisResult {
  overallScore: number;
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendations: string[];
  keywordMatch: {
    matched: string[];
    missing: string[];
  };
  summary: string;
}

/**
 * Props for the CVAnalysis component
 */
interface CVAnalysisProps {
  analysis: AnalysisResult;
  onReset: () => void;
  originalCV: string;
  jobRole: string;
  jobDescription: string;
}

/**
 * CV Analysis Results Component
 *
 * Displays comprehensive analysis results including:
 * - Overall scores and metrics
 * - Strengths and weaknesses
 * - Keyword analysis
 * - Skills gap analysis
 * - AI recommendations
 * - CV rewriting functionality
 */
export function CVAnalysis({
  analysis,
  onReset,
  originalCV,
  jobRole,
  jobDescription,
}: CVAnalysisProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  // const [renderedCV, setRenderedCV] = useState<string>();
  const [renderedCVUrl, setRenderedCVUrl] = useState<string | null>(null);
  // const [pdfLayerKey, setPdfLayerKey] = useState<string>("");

  /**
   * Returns appropriate color class based on score
   *
   * @param score - Numeric score (0-100)
   * @returns string - Tailwind color class
   */
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  // /**
  //  * Returns appropriate gradient class based on score
  //  *
  //  * @param score - Numeric score (0-100)
  //  * @returns string - Tailwind gradient class
  //  */
  // const getScoreGradient = (score: number): string => {
  //   if (score >= 80) return "from-green-500 to-emerald-500"
  //   if (score >= 60) return "from-yellow-500 to-orange-500"
  //   return "from-red-500 to-pink-500"
  // }

  /**
   * Handles CV rewriting by calling the rewrite API
   * Updates the rendered CV state with the result
   */
  const handleRewriteCV = async () => {
    setIsRewriting(true);
    try {
      const response = await fetch("/api/rewrite-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalCV,
          jobRole,
          jobDescription,
          analysis,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || "CV rewrite failed"
        );
      }

      // Check if response is actually a PDF
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("Server did not return a PDF file");
      }

      const blob = await response.blob();

      // Validate blob size
      if (blob.size === 0) {
        throw new Error("Received empty PDF file");
      }

      // Create a URL for the PDF blob
      const url = URL.createObjectURL(blob);
      setRenderedCVUrl(url);
      // setRenderedCV(renderedCVUrl)
      console.log("Rendered CV URL: ", renderedCVUrl);

      console.log(`PDF generated successfully, size: ${blob.size} bytes`);
      toast.success("CV rewrite completed successfully! 🎉");
    } catch (error) {
      console.error("CV rewriting failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`CV rewrite failed: ${errorMessage}`);
      // toast.error("CV rewrite failed. Please try again.")
    } finally {
      setIsRewriting(false);
    }
  };

  /**
   * Downloads the rewritten CV as a text file
   * Creates a downloadable blob with appropriate filename
   */
  const downloadCV = () => {
    if (!renderedCVUrl) {
      toast.error("No CV available to download");
      return;
    }

    try {
      // Create a temporary anchor to trigger download
      const link = document.createElement("a");
      link.href = renderedCVUrl;
      link.download = `rewritten_cv_${jobRole
        .replace(/\s+/g, "_")
        .toLowerCase()}.pdf`;
      link.click();

      toast.success("PDF Downloaded Initiated 📄");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to Download PDF. Please try again.");
    }
  };

  /**
   * Cleans up blob URL when component unmounts or URL changes
   */
  const cleanupBlobUrl = () => {
    if (renderedCVUrl) {
      URL.revokeObjectURL(renderedCVUrl);
      setRenderedCVUrl(null);
    }
  };

  return (
    <div className="">
      {/* Results Header */}
      <div className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  CV Analysis Results
                </h1>
                <p className="text-gray-400">
                  Comprehensive AI-powered analysis
                </p>
              </div>
            </div>
            <Button
              onClick={onReset}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overall Score Card */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Overall Analysis Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Score Display */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${getScoreColor(
                      analysis.overallScore
                    )}`}
                  >
                    {analysis.overallScore}%
                  </div>
                  <p className="text-gray-400">Overall Match</p>
                </div>
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${getScoreColor(
                      analysis.matchPercentage
                    )}`}
                  >
                    {analysis.matchPercentage}%
                  </div>
                  <p className="text-gray-400">Job Relevance</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Match Strength</span>
                  <span className="text-white">{analysis.overallScore}%</span>
                </div>
                <Progress
                  value={analysis.overallScore}
                  className="h-3 bg-gray-700"
                />
              </div>
            </CardContent>
          </Card>

          {/* Executive Summary */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>

          {/* Strengths and Weaknesses Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Strengths Card */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Key Strengths
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Areas where your CV excels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Star className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-300">{strength}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weaknesses Card */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Aspects that could be enhanced
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <XCircle className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-300">{weakness}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Keywords Analysis */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Keyword Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Job-relevant keywords found and missing in your CV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Matched Keywords */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Matched Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordMatch.matched.map((keyword, index) => (
                    <Badge
                      key={index}
                      className="bg-green-600/20 text-green-400 border-green-600/30"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Missing Keywords */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordMatch.missing.map((keyword, index) => (
                    <Badge
                      key={index}
                      className="bg-red-600/20 text-red-400 border-red-600/30"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Gap Analysis */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Skills Gap Analysis
              </CardTitle>
              <CardDescription className="text-gray-400">
                Important skills that could strengthen your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.missingSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-gray-900/50 border border-gray-700"
                  >
                    <p className="text-gray-300">{skill}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-400" />
                AI Recommendations
              </CardTitle>
              <CardDescription className="text-gray-400">
                Actionable steps to improve your CV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-600/20"
                  >
                    <p className="text-gray-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CV Rewriting Section */}
          {renderedCVUrl ? (
            <CVComparison
              originalCV={originalCV}
              renderedCVUrl={renderedCVUrl}
              jobRole={jobRole}
              analysis={analysis}
              onDownload={downloadCV}
            />
          ) : (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  AI CV Rewriter
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Generate an optimized CV based on the analysis
                  recommendations.
                </CardDescription>
                {/* <CardDescription className="text-gray-400">
                  For this feature, we use SelectPDF. You can go to <Link href="https://selectpdf.com/api/RequestKey.aspx" target="_blank" className="underline hover:text-white">selectpdf.com/api/RequestKey.aspx</Link> to learn get an API key. <br />
                  This is a paid service but they have a free tier that should be enough for testing.
                  Use your email to get the free key that lasts 7 days.
                </CardDescription> */}
              </CardHeader>
              {/* <Label htmlFor="selectpdfKey" className="text-white px-4">SelectPDF API Key *</Label>
              <Input type="text" name="selectpdfKey" /> */}
              <CardContent>
                <Button
                  onClick={handleRewriteCV}
                  disabled={isRewriting}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold py-3"
                >
                  {isRewriting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Rewriting CV...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Optimized CV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
