import { EmployeeMetrics } from '@/components/employee-metrics'
import { EmployeeTasks } from '@/components/employee-tasks'
import { EmployeeActivity } from '@/components/employee-activity'
import { EmployeeChart } from '@/components/employee-chart'
import { createClient } from '@/lib/supabase/server'
import { getEmployeeMetrics, getRecentActivity } from '@/app/actions/employee'
import { getTranslations } from 'next-intl/server'

export default async function EmployeeDashboardPage() {
  const supabase = await createClient()
  const t = await getTranslations('EmployeeDashboard')
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
    <div className="mx-auto max-w-screen-2xl space-y-8 p-8">
      {/* Welcome Message */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t('welcome', {name: displayName})}
          </h2>
          <p className="mt-1 text-muted-foreground">
            {t('overview_subtitle')}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <EmployeeMetrics metrics={metrics} />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Area */}
        <div className="col-span-4 lg:col-span-4">
          <EmployeeChart />
        </div>

        {/* Sidebar Area */}
        <div className="col-span-3 flex flex-col gap-6 lg:col-span-3">
          <EmployeeTasks 
            activeSickness={metrics.activeSickness} 
            profileComplete={metrics.profileComplete}
          />
          <EmployeeActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  )
}
