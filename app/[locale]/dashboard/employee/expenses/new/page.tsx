"use client";

import { useTransition } from "react";
import { submitExpense } from "@/app/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";


export default function NewExpensePage() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("EmployeeDashboard.new_expense_page");

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
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('submit_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Input type="text" id="description" name="description" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t('amount')}</Label>
                <Input type="number" step="0.01" id="amount" name="amount" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">{t('date')}</Label>
                <Input type="date" id="date" name="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('category')}</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder={t('select_category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">{t('travel')}</SelectItem>
                  <SelectItem value="meals">{t('meals')}</SelectItem>
                  <SelectItem value="training">{t('training')}</SelectItem>
                  <SelectItem value="equipment">{t('equipment')}</SelectItem>
                  <SelectItem value="other">{t('other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? t('submitting') : t('submit_btn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
