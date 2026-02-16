"use client";

import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Database } from "@/lib/supabase/database.types";

type Document = Database['public']['Tables']['documents']['Row'];

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Geen documenten gevonden.
      </div>
    );
  }

  const handleDownload = (path: string) => {
    // In a real app, this would generate a signed URL via a server action or API route.
    // For now, we simulate it or alert.
    alert(`Downloading ${path}... (Functionality to be implemented with Storage)`);
  };

  return (
    <div className="space-y-1">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground border">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-sm">{doc.name}</div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(doc.created_at || new Date()), "d MMMM yyyy", { locale: nl })} • {doc.type}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.path)}>
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
