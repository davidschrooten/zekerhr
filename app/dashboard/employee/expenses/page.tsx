import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Declaraties
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Beheer en dien jouw onkosten in.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employee/expenses/new">
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe Declaratie
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mijn Declaraties</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Omschrijving</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Bedrag</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses && expenses.length > 0 ? (
                expenses.map((expense: any) => (
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
                          ? "Goedgekeurd"
                          : expense.status === "rejected"
                          ? "Afgekeurd"
                          : expense.status === "paid"
                          ? "Uitbetaald"
                          : "In afwachting"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Geen declaraties gevonden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
