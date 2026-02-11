"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitLeaveRequest } from "@/app/actions/leave";

export function LeaveRequestForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await submitLeaveRequest(formData);
        // Reset form or show success message logic here
      } catch (error) {
        console.error("Failed to submit leave request", error);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4 border p-4 rounded-lg">
      <h3 className="text-lg font-medium">Request Leave</h3>
      
      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date</Label>
        <Input type="date" id="start_date" name="start_date" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="end_date">End Date</Label>
        <Input type="date" id="end_date" name="end_date" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason (Optional)</Label>
        <Input type="text" id="reason" name="reason" />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}
