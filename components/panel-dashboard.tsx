"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InterviewInterface } from "./interview-interface"
import { Users } from "lucide-react"

type Student = {
  id: string
  name: string
  panel_id: string
}

export function PanelDashboard() {
  const { profile } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile?.panel_id) {
      fetchAssignedStudents()
    }
  }, [profile])

  const fetchAssignedStudents = async () => {
    if (!profile?.panel_id) return

    try {
      const { data, error } = await supabase.from("students").select("*").eq("panel_id", profile.panel_id).order("name")

      if (error) throw error
      setStudents(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInterviewComplete = () => {
    setSelectedStudent(null)
    fetchAssignedStudents()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (selectedStudent) {
    return (
      <InterviewInterface
        student={selectedStudent}
        onComplete={handleInterviewComplete}
        onCancel={() => setSelectedStudent(null)}
      />
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Panel Dashboard</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Assigned Students ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No students assigned to your panel yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-3">{student.name}</h3>
                    <Button onClick={() => setSelectedStudent(student)} className="w-full">
                      Start Interview
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
