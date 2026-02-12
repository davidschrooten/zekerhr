"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitLeaveRequest } from "@/app/actions/leave";

export function LeaveRequestForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const start = formData.get("start_date") as string;
    const end = formData.get("end_date") as string;

    if (new Date(end) < new Date(start)) {
      setError("Einddatum moet gelijk zijn aan of na startdatum liggen.");
      return;
    }

    startTransition(async () => {
      try {
        await submitLeaveRequest(formData);
        setSuccess(true);
        (event.target as HTMLFormElement).reset();
      } catch (error) {
        console.error("Failed to submit leave request", error);
        setError("Er is iets misgegaan. Controleer je saldo of probeer het later opnieuw.");
      }
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Startdatum</Label>
          <Input 
            type="date" 
            id="start_date" 
            name="start_date" 
            required 
            min={today}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Einddatum</Label>
          <Input 
            type="date" 
            id="end_date" 
            name="end_date" 
            required 
            min={today}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reden (Optioneel)</Label>
        <Input 
          type="text" 
          id="reason" 
          name="reason" 
          placeholder="Bijv. Vakantie, Bruiloft..."
        />
      </div>

      {error && (
        <div className="text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-emerald-600 dark:text-emerald-500">
          Aanvraag succesvol ingediend!
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Bezig met indienen..." : "Verlof Aanvragen"}
      </Button>
    </form>
  );
}
