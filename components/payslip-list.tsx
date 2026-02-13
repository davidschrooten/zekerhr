"use client";

import { useState, useMemo } from "react";
import { FileText, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Database } from "@/lib/supabase/database.types";
import { getDownloadUrl } from "@/app/actions/documents";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Document = Database['public']['Tables']['documents']['Row'];

interface PayslipListProps {
  documents: Document[];
}

export function PayslipList({ documents }: PayslipListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const years = useMemo(() => {
    const y = documents.map(d => new Date(d.created_at || new Date()).getFullYear());
    return Array.from(new Set(y)).sort((a, b) => b - a);
  }, [documents]);

  const [selectedYear, setSelectedYear] = useState<number>(years[0] || new Date().getFullYear());

  const filteredDocuments = documents.filter(doc => 
    new Date(doc.created_at || new Date()).getFullYear() === selectedYear
  );

  const hasPrevious = years.some(y => y < selectedYear);
  const hasNext = years.some(y => y > selectedYear);

  const handleYearChange = (direction: 'prev' | 'next') => {
    const targetYear = direction === 'prev' 
      ? years.find(y => y < selectedYear)
      : years.slice().reverse().find(y => y > selectedYear);
    
    if (targetYear) setSelectedYear(targetYear);
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-muted/10">
        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Geen loonstroken gevonden</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">
          Er zijn nog geen loonstroken beschikbaar voor jouw account.
          Loonstroken worden doorgaans rond de 25e van de maand toegevoegd.
        </p>
      </div>
    );
  }

  const handleDownload = async (doc: Document) => {
    try {
      setDownloadingId(doc.id);
      const url = await getDownloadUrl(doc.id);
      
      // Create a temporary link and trigger click
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name; // This sets the filename for download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to alert if toast is not available (checking package.json later)
      alert("Download mislukt. Probeer het later opnieuw.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Year Navigation */}
      <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md border">
        <div className="w-10">
          {hasPrevious && (
            <Button variant="ghost" size="icon" onClick={() => handleYearChange('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="font-semibold text-sm">
          Jaar: {selectedYear}
        </div>

        <div className="w-10">
          {hasNext && (
            <Button variant="ghost" size="icon" onClick={() => handleYearChange('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40%]">Periode / Naam</TableHead>
              <TableHead className="hidden md:table-cell">Datum toegevoegd</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="text-right">Actie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                   Geen loonstroken voor {selectedYear}.
                 </TableCell>
               </TableRow>
            ) : (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="truncate max-w-[200px] sm:max-w-none">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {format(new Date(doc.created_at || new Date()), "d MMMM yyyy", { locale: nl })}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm capitalize">
                    {doc.type}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id}
                      className="gap-2 h-8"
                    >
                      {downloadingId === doc.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden sm:inline">Downloaden</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
