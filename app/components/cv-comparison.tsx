"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ArrowRight } from "lucide-react";

/**
 * Props for the CVComparison component
 */
interface CVComparisonProps {
  originalCV: string;
  jobRole: string;
  renderedCVUrl: any;
  analysis: any;
  onDownload: () => void;
  // onCopy: () => void
}

/**
 * CV Comparison Component
 *
 * Displays side-by-side comparison of original and optimized CV
 * Features:
 * - Tabbed interface for easy switching
 * - Improvements summary
 * - Download and copy functionality
 * - Score comparison
 */
export function CVComparison({
  originalCV,
  jobRole,
  renderedCVUrl,
  analysis,
  onDownload,
}: CVComparisonProps) {
  const [tabValue, setTabValue] = useState("optimized");

  // List of improvements made to the CV
  const improvements = [
    "Enhanced keyword optimization",
    "Improved skills presentation",
    "Better job relevance alignment",
    "Strengthened weak areas",
    "Professional formatting",
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-400" />
          CV Comparison & Download
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Improvements Summary */}
        <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-600/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-green-400" />
            Key Improvements Made
          </h4>
          <div className="flex flex-wrap gap-2">
            {improvements.map((improvement, index) => (
              <Badge
                key={index}
                className="bg-green-600/20 text-green-400 border-green-600/30"
              >
                {improvement}
              </Badge>
            ))}
          </div>
        </div>

        {/* CV Comparison Tabs */}
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          <TabsList className="grid w-full grid-cols-1 bg-gray-900/50">
            <TabsTrigger
              value="optimized"
              className="data-[state=active]:bg-blue-600"
            >
              Optimized CV
            </TabsTrigger>
            {/* <TabsTrigger value="original" className="data-[state=active]:bg-gray-600">
              Original CV
            </TabsTrigger> */}
          </TabsList>

          {/* Optimized CV Tab */}
          <div className={tabValue === "optimized" ? "space-y-4" : "hidden"}>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 h-96 overflow-y-auto">
              {renderedCVUrl && (
                <>
                  <iframe
                    src={`${renderedCVUrl}#toolbar=0`}
                    className="w-full bg-white h-full rounded-md border border-gray-700"
                  />
                </>
              )}
            </div>
            <div className="sm:flex-row flex-col flex items-center justify-center gap-2">
              <Button
                onClick={onDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Optimized CV
              </Button>
            </div>
          </div>

          {/* Original CV Tab */}
          {/* <div className={tabValue === "original" ? "space-y-4" : "hidden"}>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{originalCV}</pre>
            </div>
            <p className="text-gray-400 text-sm">This is your original CV for comparison purposes.</p>
          </div> */}
        </Tabs>

        {/* Score Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {analysis.overallScore}%
            </div>
            <p className="text-gray-400 text-sm">Original Match Score</p>
          </div>
          <div className="bg-gray-900/50 border border-green-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.min(100, analysis.overallScore + 15)}%
            </div>
            <p className="text-gray-400 text-sm">Estimated New Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
