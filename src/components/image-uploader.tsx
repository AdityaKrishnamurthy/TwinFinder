"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ImageUploaderProps = {
  id: string;
  image: string | null;
  onImageChange: (image: string | null) => void;
  title: string;
};

export function ImageUploader({
  id,
  image,
  onImageChange,
  title,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImageChange(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card className="relative group overflow-hidden transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:shadow-lg">
      <CardContent
        className="p-0"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={id}
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {image ? (
          <>
            <Image
              src={image}
              alt={title}
              width={600}
              height={400}
              className="object-cover w-full aspect-[3/2] transition-transform duration-300 group-hover:scale-105"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div
            className={cn(
              'flex flex-col items-center justify-center w-full aspect-[3/2] border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
              isDragging ? 'bg-muted border-primary' : 'border-border'
            )}
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP, etc.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
