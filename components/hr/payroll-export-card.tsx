"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generatePayrollData } from "@/app/actions/payroll";

export function PayrollExportCard() {
  const [isPending, startTransition] = useTransition();
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString()); // 0-11
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const handleExport = () => {
    startTransition(async () => {
      try {
        const month = parseInt(selectedMonth) + 1; // 1-12
        const year = parseInt(selectedYear);
        const data = await generatePayrollData(year, month);
        
        // Generate CSV
        const headers = ["Type", "User", "Email", "Date", "Details"];
        const rows = [];

        // New Hires
        data.newHires.forEach(h => {
          rows.push([
            "NEW_HIRE",
            h.profiles?.full_name || "N/A",
            h.profiles?.email || "N/A",
            h.start_date,
            `Salary: ${h.salary_gross_cents/100}, FTE: ${h.fte}`
          ]);
        });

        // Terminations
        data.terminations.forEach(t => {
          rows.push([
            "TERMINATION",
            t.profiles?.full_name || "N/A",
            t.profiles?.email || "N/A",
            t.end_date,
            "Contract Ended"
          ]);
        });

        // Sickness
        data.sickness.forEach(s => {
          const type = s.recovery_date ? "SICKNESS_RECOVERY" : "SICKNESS_REPORT";
          const date = s.recovery_date || s.report_date;
          rows.push([
            type,
            s.profiles?.full_name || "N/A",
            s.profiles?.email || "N/A",
            date,
            `Status: ${s.status}`
          ]);
        });

        const csvContent = [
          headers.join(","),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join("\n");

        // Download
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payroll_export_${year}_${month.toString().padStart(2, '0')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to export payroll", error);
        alert("Failed to export: " + (error as Error).message);
      }
    });
  };

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} disabled={isPending} className="w-full">
          {isPending ? "Generating..." : "Download CSV Export"}
        </Button>
      </CardContent>
    </Card>
  );
}
