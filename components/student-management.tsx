"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2 } from "lucide-react"

type Student = {
  id: string
  name: string
  panel_id: string | null
  created_at: string
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [newStudentName, setNewStudentName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setStudents(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStudentName.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase.from("students").insert([{ name: newStudentName.trim() }])

      if (error) throw error

      setNewStudentName("")
      await fetchStudents()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase.from("students").delete().eq("id", id)

      if (error) throw error
      await fetchStudents()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addStudent} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Enter student name"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-6">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Students List ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Panel Assignment</TableHead>
                <TableHead>Added Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.panel_id ? "Assigned" : "Not Assigned"}</TableCell>
                  <TableCell>{new Date(student.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => deleteStudent(student.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
