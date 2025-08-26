"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Binoculars } from "lucide-react";
import PdfUploader from "@/components/pdf-uploader";
import { CVAnalysis } from "@/app/components/cv-analysis";

interface Props {
  analysis: any;
  setAnalysis: (analysis: any) => void;
}

export default function CVAnalysisForm() {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // Welcome toast
  // useEffect(() => {
  //   toast("Welcome To Your Personal AI Powered CV Analyst", { icon: "👋🏽" });
  // }, []);

  const handleAnalyze = async () => {
    if (!jobRole || !cvText) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRole, jobDescription, cvText }),
      });
      if (!response.ok) throw new Error("Analysis failed");
      const result = await response.json();
      toast.success("CV Analysis Complete");
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setJobRole("");
    setJobDescription("");
    setCvText("");
    setCvFile(null);
  };

  if (analysis) {
    return (
      <CVAnalysis
        analysis={analysis}
        onReset={resetAnalysis}
        originalCV={cvText}
        jobRole={jobRole}
        jobDescription={jobDescription}
      />
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5" />
          CV Analysis Setup
        </CardTitle>
        <CardDescription className="text-gray-400">
          Provide job details and your CV for comprehensive analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="jobRole" className="text-white">
            Job Role *
          </Label>
          <Input
            id="jobRole"
            placeholder="e.g., Senior Software Engineer, Marketing Manager"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobDescription" className="text-white">
            Job Description (Optional but Recommended)
          </Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the job description here for more accurate analysis..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
          />
        </div>
        <div className="space-y-4">
          <Label className="text-white">CV Content *</Label>
          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
              <TabsTrigger
                value="paste"
                className="data-[state=active]:bg-blue-600"
              >
                Paste Text
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-blue-600"
              >
                Upload File
              </TabsTrigger>
            </TabsList>
            <TabsContent value="paste" className="space-y-2">
              <Textarea
                placeholder="Paste your CV content here..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={8}
                className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
              />
            </TabsContent>
            <PdfUploader
              cvFile={cvFile}
              setCvFile={setCvFile}
              setCvText={setCvText}
            />
          </Tabs>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={!jobRole || !cvText || isAnalyzing}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-3 text-lg"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Analyzing CV...
            </>
          ) : (
            <>
              <Binoculars className="h-5 w-5 mr-2" />
              Analyze CV
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
