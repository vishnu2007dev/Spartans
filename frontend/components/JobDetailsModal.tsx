"use client";

import { useEffect } from "react";
import { X, ExternalLink, MapPin, Building2, Clock, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/types";

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  selected: boolean;
  onToggle: () => void;
  disabled: boolean;
}

export function JobDetailsModal({ job, onClose, selected, onToggle, disabled }: JobDetailsModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (job) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [job]);

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl relative bg-[var(--bg)] border border-[var(--border)] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-[var(--border)] bg-[var(--bg-elev)]">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--border)] transition-colors text-[var(--text-muted)]"
          >
            <X size={20} />
          </button>

          <div className="pr-10">
            <h2 className="text-2xl font-bold text-[var(--heading)] mb-3 leading-tight tracking-tight font-manrope">
              {job.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5 font-medium">
                <Building2 size={16} />
                {job.company}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={16} />
                {job.location || "Remote"}
              </div>
              {job.type && (
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span className="uppercase font-mono text-xs">{job.type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {job.requiredSkills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--heading)] mb-3 flex items-center gap-2 uppercase tracking-wide">
                <Briefcase size={16} /> Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="mono" className="text-[11px] px-2.5 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-[var(--heading)] mb-3 uppercase tracking-wide">
              Job Description
            </h3>
            <div 
              className="text-sm leading-relaxed text-[var(--text-muted)] whitespace-pre-wrap"
            >
              {job.description}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 p-5 border-t border-[var(--border)] bg-[var(--bg-elev)] flex justify-between items-center">
          <Button 
            variant={selected ? "accent" : disabled ? "outline" : "default"} 
            onClick={onToggle}
            disabled={disabled && !selected}
            className="w-32"
          >
            {selected ? "Selected ✓" : "Select Role"}
          </Button>

          {job.url && (
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--heading)] flex items-center gap-1.5 transition-colors"
            >
              View original posting
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Click outside to close (handled by wrapping div clicking, but to be safe) */}
      <div className="absolute inset-0 z-[-1]" onClick={onClose} />
    </div>
  );
}
