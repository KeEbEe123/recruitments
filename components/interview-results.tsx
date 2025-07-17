"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

type InterviewResult = {
  id: string;
  student_id: string;
  panel_id: string;
  scores: Record<string, number>;
  total_score: number;
  tier: string;
  photo_url: string | null;
  timestamp: string;
  students: { name: string };
  panels: { name: string };
};

export function InterviewResults() {
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from("interviews")
        .select(
          `
          *,
          students(name),
          panels(name)
        `
        )
        .order("timestamp", { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Tier 1":
        return "bg-green-100 text-green-800";
      case "Tier 2":
        return "bg-blue-100 text-blue-800";
      case "Tier 3":
        return "bg-yellow-100 text-yellow-800";
      case "Tier 4":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div>Loading results...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Interview Results ({results.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Panel</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">
                    {result.students.name}
                  </TableCell>
                  <TableCell>{result.panels.name}</TableCell>
                  <TableCell>{result.total_score}/20</TableCell>
                  <TableCell>
                    <Badge className={getTierColor(result.tier)}>
                      {result.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(result.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
