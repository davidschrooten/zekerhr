"use client";

import { useTransition } from "react";
import { inviteUser } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InviteUserForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await inviteUser(formData);
        alert("User invited successfully");
        // Reset form logic would go here (or use a ref to form)
      } catch (error) {
        console.error("Failed to invite user", error);
        alert("Failed to invite user: " + (error as Error).message);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite New Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input type="text" id="full_name" name="full_name" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" required defaultValue="employee">
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="hr_admin">HR Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input type="date" id="start_date" name="start_date" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Monthly Gross Salary (€)</Label>
              <Input type="number" step="0.01" id="salary" name="salary" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fte">FTE (0.0 - 1.0)</Label>
              <Input type="number" step="0.1" min="0" max="1" id="fte" name="fte" required defaultValue="1.0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="bsn">BSN (Encrypted)</Label>
              <Input type="text" id="bsn" name="bsn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN (Encrypted)</Label>
              <Input type="text" id="iban" name="iban" required />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Inviting..." : "Invite User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
