"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

type Student = {
  id: string
  name: string
  panel_id: string | null
}

type Panel = {
  id: string
  name: string
}

export function PanelAssignment() {
  const [students, setStudents] = useState<Student[]>([])
  const [panels, setPanels] = useState<Panel[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [studentsResult, panelsResult] = await Promise.all([
        supabase.from("students").select("*").order("name"),
        supabase.from("panels").select("*").order("name"),
      ])

      if (studentsResult.error) throw studentsResult.error
      if (panelsResult.error) throw panelsResult.error

      setStudents(studentsResult.data || [])
      setPanels(panelsResult.data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const assignStudentToPanel = async (studentId: string, panelId: string | null) => {
    try {
      const { error } = await supabase.from("students").update({ panel_id: panelId }).eq("id", studentId)

      if (error) throw error
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const getStudentsByPanel = (panelId: string) => {
    return students.filter((student) => student.panel_id === panelId)
  }

  const getUnassignedStudents = () => {
    return students.filter((student) => !student.panel_id)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {panels.map((panel) => (
          <Card key={panel.id}>
            <CardHeader>
              <CardTitle className="text-lg">{panel.name}</CardTitle>
              <Badge variant="secondary">{getStudentsByPanel(panel.id).length} students</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getStudentsByPanel(panel.id).map((student) => (
                  <div key={student.id} className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">{student.name}</div>
                    <Select
                      value={student.panel_id || "unassigned"}
                      onValueChange={(value) => assignStudentToPanel(student.id, value === "unassigned" ? null : value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Reassign panel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassign</SelectItem>
                        {panels.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {getUnassignedStudents().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Students</CardTitle>
            <Badge variant="outline">{getUnassignedStudents().length} students</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getUnassignedStudents().map((student) => (
                <div key={student.id} className="p-3 border rounded">
                  <div className="font-medium mb-2">{student.name}</div>
                  <Select
                    value="unassigned"
                    onValueChange={(value) => assignStudentToPanel(student.id, value === "unassigned" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to panel" />
                    </SelectTrigger>
                    <SelectContent>
                      {panels.map((panel) => (
                        <SelectItem key={panel.id} value={panel.id}>
                          {panel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
