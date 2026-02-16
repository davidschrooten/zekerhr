"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUploadUrl, saveDocumentRef } from "@/app/actions/documents";
import { Loader2 } from "lucide-react";

interface DocumentUploadProps {
  sicknessLogId: string;
  onUploadComplete?: () => void;
}

export function DocumentUpload({ sicknessLogId, onUploadComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      // 1. Get Signed URL
      const { signedUrl, path } = await getUploadUrl(sicknessLogId, file.name);

      // 2. Upload to Storage
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) throw new Error("Upload failed");

      // 3. Save Reference
      await saveDocumentRef(sicknessLogId, file.name, path, file.type);

      setFile(null);
      if (onUploadComplete) onUploadComplete();
      alert("Document uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h4 className="text-sm font-medium">Upload Document</h4>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="document">File</Label>
        <Input 
          id="document" 
          type="file" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isUploading}
        />
      </div>
      <Button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Upload
      </Button>
    </div>
  );
}
