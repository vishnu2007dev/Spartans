"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import * as mammoth from "mammoth/mammoth.browser";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FilePreviewProps {
  file: File;
}

export function FilePreview({ file }: FilePreviewProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
  const isDocx = file.name.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  useEffect(() => {
    if (isDocx) {
      const readDocx = async () => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setHtmlContent(result.value);
        } catch (err) {
          setError("Failed to preview DOCX file.");
          console.error(err);
        }
      };
      readDocx();
    } else {
      setHtmlContent(null);
      setError(null);
    }
  }, [file, isDocx]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-sm" style={{ color: "#ef4444" }}>
        {error}
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="flex flex-col items-center w-full max-h-full overflow-y-auto overflow-x-hidden">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="max-w-full flex flex-col items-center"
          loading={<p className="text-sm text-gray-500 py-10">Loading PDF...</p>}
          error={<p className="text-sm text-red-500 py-10">Failed to load PDF.</p>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="mb-4 border shadow-sm" style={{ borderColor: "var(--border)" }}>
              <Page 
                pageNumber={index + 1} 
                renderTextLayer={false} 
                renderAnnotationLayer={false}
                width={500}
              />
            </div>
          ))}
        </Document>
      </div>
    );
  }

  if (isDocx) {
    return (
      <div className="w-full max-h-full overflow-y-auto bg-white text-black p-8 rounded-xl shadow-sm border border-gray-200">
        {htmlContent ? (
          <div 
            className="prose prose-sm max-w-none" 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        ) : (
          <p className="text-sm text-gray-500 py-10 text-center">Loading DOCX...</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>
      Unsupported file type.
    </div>
  );
}
