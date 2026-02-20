"use client"

import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Jan", hours: 160 },
  { name: "Feb", hours: 152 },
  { name: "Mar", hours: 168 },
  { name: "Apr", hours: 160 },
  { name: "May", hours: 144 },
  { name: "Jun", hours: 160 },
]

export function EmployeeChart() {
  return (
    <Card className="rounded-organic border-none bg-white shadow-organic p-2">
      <CardHeader className="px-8 pt-8 pb-2">
        <CardTitle className="text-lg font-medium text-espresso tracking-tight">Gewerkte Uren (2026)</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B735B" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8B735B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EBE3" />
              <XAxis 
                dataKey="name" 
                stroke="#8C857E" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#FFFFFF", 
                  borderColor: "transparent",
                  borderRadius: "16px",
                  boxShadow: "0 8px 30px rgba(139,115,91,0.08)",
                  color: "#2D2926",
                  padding: "12px 16px"
                }}
                itemStyle={{ color: "#8B735B", fontWeight: 500 }}
              />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="#8B735B" 
                fillOpacity={1} 
                fill="url(#colorHours)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
