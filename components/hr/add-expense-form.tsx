"use client";

import { useTransition } from "react";
import { addWKRExpense } from "@/app/actions/wkr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddExpenseForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await addWKRExpense(formData);
        // Could reset form here
      } catch (error) {
        console.error("Failed to add expense", error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input type="text" id="description" name="description" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (€)</Label>
              <Input type="number" step="0.01" id="amount" name="amount" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taxable">Taxable (Uses Budget)</SelectItem>
                <SelectItem value="targeted_exemption">Targeted Exemption (Free)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Log Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
