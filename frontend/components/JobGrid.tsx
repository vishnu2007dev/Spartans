import { JobCard } from "@/components/JobCard";
import type { Job } from "@/lib/types";

interface JobGridProps {
  jobs: Job[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  maxReached: boolean;
}

export function JobGrid({ jobs, selectedIds, onToggle, maxReached }: JobGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          selected={selectedIds.has(job.id)}
          onToggle={() => onToggle(job.id)}
          disabled={maxReached && !selectedIds.has(job.id)}
        />
      ))}
    </div>
  );
}
