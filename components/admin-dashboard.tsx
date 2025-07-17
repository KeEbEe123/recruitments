"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentManagement } from "./student-management"
import { MetricsManagement } from "./metrics-management"
import { PanelAssignment } from "./panel-assignment"
import { InterviewResults } from "./interview-results"

export function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="panels">Panel Assignment</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentManagement />
        </TabsContent>

        <TabsContent value="metrics">
          <MetricsManagement />
        </TabsContent>

        <TabsContent value="panels">
          <PanelAssignment />
        </TabsContent>

        <TabsContent value="results">
          <InterviewResults />
        </TabsContent>
      </Tabs>
    </div>
  )
}
