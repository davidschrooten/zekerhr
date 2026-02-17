import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getExpenses } from "@/app/actions/expenses";
import { AnimatePage } from "@/components/animate-page";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const t = await getTranslations("EmployeeDashboard.expenses_page");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const year = params.year ? parseInt(params.year as string) : currentYear;
  const month = params.month ? parseInt(params.month as string) : currentMonth;

  const expenses = await getExpenses(month, year);

  // Calculate previous and next month dates
  const prevDate = new Date(year, month - 2);
  const nextDate = new Date(year, month);

  // We should ideally use Intl.DateTimeFormat but for now, let's keep it simple or fetch from messages if we had month names there.
  // Using Intl.DateTimeFormat for month name
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <AnimatePage className="mx-auto max-w-screen-2xl px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employee/expenses/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('new_expense')}
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">
            {t('overview_month', {month: monthName, year: year})}
        </h2>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/employee/expenses?month=${prevDate.getMonth() + 1}&year=${prevDate.getFullYear()}`}>
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="outline" size="sm" disabled={nextDate > new Date()} asChild={!(nextDate > new Date())}>
                {nextDate > new Date() ? (
                    <span><ChevronRight className="h-4 w-4" /></span>
                ) : (
                    <Link href={`/dashboard/employee/expenses?month=${nextDate.getMonth() + 1}&year=${nextDate.getFullYear()}`}>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                )}
            </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('description')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead>{t('amount')}</TableHead>
                <TableHead>{t('status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses && expenses.length > 0 ? (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="capitalize">{expense.category}</TableCell>
                    <TableCell>€ {(expense.amount_cents / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          expense.status === "approved"
                            ? "default"
                            : expense.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {expense.status === "approved"
                          ? t('approved')
                          : expense.status === "rejected"
                          ? t('rejected')
                          : expense.status === "paid"
                          ? t('paid')
                          : t('pending')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                    {t('no_expenses')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AnimatePage>
  );
}