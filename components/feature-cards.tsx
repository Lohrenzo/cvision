import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Zap } from "lucide-react";

export default function FeatureCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <Target className="h-8 w-8 text-blue-400 mb-2" />
          <CardTitle className="text-white">Job Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            Analyze how well your CV aligns with specific job requirements
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <TrendingUp className="h-8 w-8 text-purple-400 mb-2" />
          <CardTitle className="text-white">Skill Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            Get detailed feedback on your skills and experience relevance
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <Zap className="h-8 w-8 text-green-400 mb-2" />
          <CardTitle className="text-white">Improvement Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            Receive actionable recommendations to enhance your CV
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
