"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, X } from "lucide-react";

type Student = {
  id: string;
  name: string;
  panel_id: string;
};

type Metric = {
  id: string;
  name: string;
  max_score: number;
};

interface InterviewInterfaceProps {
  student: Student;
  onComplete: () => void;
  onCancel: () => void;
}

export function InterviewInterface({
  student,
  onComplete,
  onCancel,
}: InterviewInterfaceProps) {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from("metrics")
        .select("*")
        .order("created_at");

      if (error) throw error;

      const metricsData = data || [];
      setMetrics(metricsData);

      // Initialize scores
      const initialScores: Record<string, number> = {};
      metricsData.forEach((metric) => {
        initialScores[metric.id] = 0;
      });
      setScores(initialScores);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const calculateTier = (totalScore: number): string => {
    if (totalScore >= 16) return "Tier 1";
    if (totalScore >= 12) return "Tier 2";
    if (totalScore >= 8) return "Tier 3";
    return "Tier 4";
  };

  const handleScoreChange = (metricId: string, score: number) => {
    setScores((prev) => ({ ...prev, [metricId]: score }));
  };

  const endInterview = async () => {
    setLoading(true);
    setError("");

    try {
      const totalScore = Object.values(scores).reduce(
        (sum, score) => sum + score,
        0
      );
      const tier = calculateTier(totalScore);

      const { error } = await supabase.from("interviews").insert([
        {
          student_id: student.id,
          panel_id: profile!.panel_id!,
          scores,
          total_score: totalScore,
          tier,
        },
      ]);

      if (error) throw error;

      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalScore = Object.values(scores).reduce(
    (sum, score) => sum + score,
    0
  );
  const maxPossibleScore = metrics.length * 4;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Interview: {student.name}</h1>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Scoring */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Metrics</CardTitle>
              <div className="text-sm text-gray-600">
                Total Score: {totalScore}/{maxPossibleScore} | Tier:{" "}
                <span className="font-semibold">
                  {calculateTier(totalScore)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {metrics.map((metric) => (
                <div key={metric.id} className="space-y-2">
                  <Label className="text-base font-medium">{metric.name}</Label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map((score) => (
                      <Button
                        key={score}
                        variant={
                          scores[metric.id] === score ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleScoreChange(metric.id, score)}
                        className="w-12 h-12"
                      >
                        {score}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                onClick={endInterview}
                disabled={loading || totalScore === 0}
                className="w-full mt-8"
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "End Interview"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
