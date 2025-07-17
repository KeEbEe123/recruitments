"use client"

import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/login-form"
import { AdminDashboard } from "@/components/admin-dashboard"
import { PanelDashboard } from "@/components/panel-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Home() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user || !profile) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Interview Evaluation System</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile.email} ({profile.role})
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main>{profile.role === "admin" ? <AdminDashboard /> : <PanelDashboard />}</main>
    </div>
  )
}
