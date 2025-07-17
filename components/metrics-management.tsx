"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save } from "lucide-react"

type Metric = {
  id: string
  name: string
  max_score: number
}

export function MetricsManagement() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.from("metrics").select("*").order("created_at", { ascending: true })

      if (error) throw error
      setMetrics(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateMetric = async (id: string, name: string) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.from("metrics").update({ name }).eq("id", id)

      if (error) throw error

      setSuccess("Metrics updated successfully!")
      await fetchMetrics()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMetricChange = (id: string, newName: string) => {
    setMetrics(metrics.map((metric) => (metric.id === id ? { ...metric, name: newName } : metric)))
  }

  const saveAllMetrics = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const updates = metrics.map((metric) =>
        supabase.from("metrics").update({ name: metric.name }).eq("id", metric.id),
      )

      await Promise.all(updates)
      setSuccess("All metrics updated successfully!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={metric.id} className="flex items-center gap-4">
                <Label className="w-20">Metric {index + 1}:</Label>
                <Input
                  value={metric.name}
                  onChange={(e) => handleMetricChange(metric.id, e.target.value)}
                  placeholder="Enter metric name"
                />
                <span className="text-sm text-gray-500">Max: {metric.max_score}</span>
              </div>
            ))}
          </div>

          <Button onClick={saveAllMetrics} disabled={loading} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save All Metrics"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
