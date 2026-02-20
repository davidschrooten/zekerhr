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
    <AnimatePage className="mx-auto max-w-screen-2xl px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-medium tracking-tight text-espresso">
            {t('title')}
          </h1>
          <p className="mt-2 text-lg text-taupe font-normal">
            {t('subtitle')}
          </p>
        </div>
        <Button className="rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
          <Link href="/dashboard/employee/expenses/new">
            <Plus className="mr-2 h-5 w-5 stroke-[1.5]" />
            {t('new_expense')}
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-medium text-espresso tracking-tight">
            {t('overview_month', {month: monthName, year: year})}
        </h2>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full border-none bg-white shadow-sm hover:bg-wheat hover:text-espresso" asChild>
                <Link href={`/dashboard/employee/expenses?month=${prevDate.getMonth() + 1}&year=${prevDate.getFullYear()}`}>
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full border-none bg-white shadow-sm hover:bg-wheat hover:text-espresso" disabled={nextDate > new Date()} asChild={!(nextDate > new Date())}>
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

      <Card className="border-none shadow-organic rounded-organic bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-cream border-b-0">
              <TableRow className="border-b-0 hover:bg-cream">
                <TableHead className="font-medium text-taupe py-6 pl-8">{t('date')}</TableHead>
                <TableHead className="font-medium text-taupe py-6">{t('description')}</TableHead>
                <TableHead className="font-medium text-taupe py-6">{t('category')}</TableHead>
                <TableHead className="font-medium text-taupe py-6">{t('amount')}</TableHead>
                <TableHead className="font-medium text-taupe py-6 pr-8">{t('status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses && expenses.length > 0 ? (
                expenses.map((expense) => (
                  <TableRow key={expense.id} className="border-b-0 hover:bg-beige-light transition-colors">
                    <TableCell className="py-6 pl-8 text-espresso font-medium">{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell className="py-6 text-espresso">{expense.description}</TableCell>
                    <TableCell className="capitalize py-6 text-taupe">{expense.category}</TableCell>
                    <TableCell className="py-6 font-mono text-espresso">€ {(expense.amount_cents / 100).toFixed(2)}</TableCell>
                    <TableCell className="py-6 pr-8">
                      <Badge
                        variant="secondary"
                        className={`rounded-full px-3 py-1 font-medium ${
                          expense.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : expense.status === "rejected"
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : expense.status === "paid"
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
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
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center text-taupe h-32 py-12">
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