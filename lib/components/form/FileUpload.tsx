"use client";

import React from "react";
import { Box, Text } from "@chakra-ui/react";

export interface FileUploadProps {
  /** Accepted file types (e.g. ".pdf,.jpg,.png" or "image/*") */
  accept?: string;
  /** Whether multiple files can be selected */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  /** Callback fired when files are selected or dropped */
  onChange?: (files: File[]) => void;
  /** Display title inside the dropzone */
  dropzoneTitle?: string;
  /** Custom ID for the file input */
  id?: string;
}

const UPLOAD_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

/**
 * MedixDeck FileUpload
 *
 * Drag-and-drop styled file input area.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   label="Medical Records"
 *   accept=".pdf,.doc"
 *   onChange={(files) => console.log(files)}
 * />
 * ```
 */
export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  onChange,
  dropzoneTitle = "Click or drag to upload",
  id,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFileNames, setSelectedFileNames] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDisabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // Filter by max size if needed
    const validFiles = Array.from(files).filter((file) => {
      if (maxSize && file.size > maxSize) return false;
      return true;
    });

    setSelectedFileNames(validFiles.map((f) => f.name));
    onChange?.(validFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isDisabled) return;
    
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const borderColor = isInvalid
    ? "red.500"
    : isDragging
    ? "blue.500"
    : "border";

  const bg = isDragging ? "bg.subtle" : "transparent";

  return (
    <Box w="100%">
      {label && (
        <Text mb="1.5" fontSize="sm" fontWeight="medium" color="text.heading" fontFamily="var(--font-body)">
          {label}
        </Text>
      )}

      <Box
        position="relative"
        border="1.5px dashed"
        borderColor={borderColor}
        borderRadius="xl"
        bg={bg}
        px="6"
        py="8"
        textAlign="center"
        transition="all 0.2s ease"
        opacity={isDisabled ? 0.5 : 1}
        cursor={isDisabled ? "not-allowed" : "pointer"}
        _hover={!isDisabled ? { borderColor: "blue.500", bg: "bg.subtle" } : undefined}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isDisabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          style={{ display: "none" }}
          onChange={handleChange}
        />
        
        <Box color="text.muted" display="flex" justifyContent="center" mb="3">
          {UPLOAD_ICON}
        </Box>
        
        <Text fontSize="sm" fontWeight="medium" color={isDragging ? "blue.500" : "text.heading"} fontFamily="var(--font-body)">
          {dropzoneTitle}
        </Text>
        
        <Text fontSize="xs" color="text.muted" mt="1" fontFamily="var(--font-body)">
          {accept ? `Accepts ${accept}` : "All file types supported"}
          {maxSize && ` up to ${Math.round(maxSize / 1024 / 1024)}MB`}
        </Text>

        {selectedFileNames.length > 0 && (
          <Box mt="4" pt="3" borderTop="1px solid" borderColor="border">
            <Text fontSize="xs" fontWeight="semibold" color="text.heading" mb="1" fontFamily="var(--font-body)">
              Selected file{selectedFileNames.length > 1 ? "s" : ""}:
            </Text>
            {selectedFileNames.map((name, i) => (
              <Text key={i} fontSize="xs" color="text.muted" isTruncated fontFamily="var(--font-body)">
                {name}
              </Text>
            ))}
          </Box>
        )}
      </Box>

      {(helperText || errorMessage) && (
        <Text mt="1.5" fontSize="xs" color={isInvalid ? "red.500" : "text.muted"} fontFamily="var(--font-body)">
          {isInvalid ? errorMessage : helperText}
        </Text>
      )}
    </Box>
  );
}
