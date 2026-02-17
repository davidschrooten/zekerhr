"use client";

import { useTransition } from "react";
import { submitExpense } from "@/app/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function NewExpensePage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await submitExpense(formData);
        // Could reset form here
      } catch (error) {
        console.error("Failed to submit expense", error);
      }
    });
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Nieuwe Declaratie
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vul de details van jouw uitgave in.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Declaratie Indienen</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Omschrijving</Label>
              <Input type="text" id="description" name="description" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Bedrag (€)</Label>
                <Input type="number" step="0.01" id="amount" name="amount" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Datum</Label>
                <Input type="date" id="date" name="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categorie</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer Categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Reiskosten</SelectItem>
                  <SelectItem value="meals">Maaltijden</SelectItem>
                  <SelectItem value="training">Opleiding</SelectItem>
                  <SelectItem value="equipment">Apparatuur</SelectItem>
                  <SelectItem value="other">Overig</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Versturen..." : "Declaratie Indienen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
