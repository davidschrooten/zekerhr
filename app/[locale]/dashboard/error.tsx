"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-[500px]">
          Er is een onverwachte fout opgetreden. Probeer het opnieuw of neem contact op met support als het probleem aanhoudt.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => reset()}>Probeer opnieuw</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>Naar Home</Button>
        </div>
      </div>
    </div>
  )
}
