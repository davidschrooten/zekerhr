"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { revealSensitiveData, storeSensitiveData } from "@/app/actions/secure";

interface SensitiveDataCardProps {
  userId: string;
  isEditable?: boolean; // If true, allows editing (e.g. initial setup)
}

export function SensitiveDataCard({ userId, isEditable = false }: SensitiveDataCardProps) {
  const [revealedData, setRevealedData] = useState<{ bsn: string, iban: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const handleReveal = () => {
    startTransition(async () => {
      try {
        const data = await revealSensitiveData(userId);
        if (data) {
          setRevealedData({ bsn: data.bsn, iban: data.iban });
        }
      } catch (error) {
        console.error("Failed to reveal data", error);
        alert("Failed to reveal data: " + (error as Error).message);
      }
    });
  };

  const handleSave = (formData: FormData) => {
    startTransition(async () => {
      try {
        const bsn = formData.get("bsn") as string;
        const iban = formData.get("iban") as string;
        await storeSensitiveData(userId, bsn, iban);
        setIsEditing(false);
        setRevealedData(null); // Clear revealed data to force re-fetch/hide
      } catch (error) {
        console.error("Failed to save data", error);
        alert("Failed to save data");
      }
    });
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Sensitive Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bsn">BSN</Label>
              <Input id="bsn" name="bsn" required placeholder="123456789" className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input id="iban" name="iban" required placeholder="NL99BANK0123456789" className="font-mono" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>Save</Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sensitive Data</CardTitle>
        <LockIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">BSN</Label>
          <div className="font-mono text-sm">
            {revealedData ? revealedData.bsn : "•••• •••• •••"}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">IBAN</Label>
          <div className="font-mono text-sm">
            {revealedData ? revealedData.iban : "NL•• •••• •••• •••• ••"}
          </div>
        </div>

        <div className="flex gap-2">
          {!revealedData ? (
            <Button variant="outline" size="sm" onClick={handleReveal} disabled={isPending} className="w-full">
              <EyeIcon className="mr-2 h-4 w-4" />
              {isPending ? "Revealing..." : "Reveal"}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setRevealedData(null)} className="w-full">
              <EyeOffIcon className="mr-2 h-4 w-4" />
              Hide
            </Button>
          )}
          
          {isEditable && !revealedData && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
        
        {revealedData && (
            <p className="text-[10px] text-muted-foreground text-center">
                This action has been logged.
            </p>
        )}
      </CardContent>
    </Card>
  );
}
