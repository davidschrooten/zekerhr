import { EmployeeMetrics } from '@/components/employee-metrics'
import { EmployeeTasks } from '@/components/employee-tasks'
import { EmployeeActivity } from '@/components/employee-activity'
import { createClient } from '@/lib/supabase/server'
import { getEmployeeMetrics, getRecentActivity } from '@/app/actions/employee'

export default async function EmployeeDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }
  
  // Parallel data fetching
  const [profileResponse, metrics, recentActivity] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    getEmployeeMetrics(),
    getRecentActivity()
  ]);

  const profile = profileResponse.data;
  const displayName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Collega'

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Goedemorgen, {displayName}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hier is jouw persoonlijke overzicht
        </p>
      </div>

      {/* Metrics Grid */}
      <EmployeeMetrics metrics={metrics} />

      {/* Two Column Layout */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Tasks */}
        <EmployeeTasks 
          activeSickness={metrics.activeSickness} 
          profileComplete={metrics.profileComplete}
        />

        {/* Recent Activity */}
        <EmployeeActivity activities={recentActivity} />
      </div>
    </div>
  )
}
