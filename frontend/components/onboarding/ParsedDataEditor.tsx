"use client";

import { useState } from "react";
import type { ParsedResume } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface ParsedDataEditorProps {
  data: ParsedResume;
  onChange: (newData: ParsedResume) => void;
}

export function ParsedDataEditor({ data, onChange }: ParsedDataEditorProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    onChange({ ...data, skills: [...data.skills, newSkill.trim()] });
    setNewSkill("");
  };

  const handleRemoveSkill = (index: number) => {
    const updated = [...data.skills];
    updated.splice(index, 1);
    onChange({ ...data, skills: updated });
  };

  const handleExperienceChange = (index: number, val: string) => {
    const updated = [...data.experience];
    updated[index] = val;
    onChange({ ...data, experience: updated });
  };

  const handleEducationChange = (index: number, val: string) => {
    const updated = [...data.education];
    updated[index] = val;
    onChange({ ...data, education: updated });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-h-full overflow-y-auto pr-2 pb-8">
      {/* Skills Section */}
      <section>
        <h3 className="font-semibold text-lg mb-3" style={{ color: "var(--heading)" }}>Skills</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.skills.map((skill, i) => (
            <div 
              key={i} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
              style={{ backgroundColor: "var(--bg-elev)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <span>{skill}</span>
              <button onClick={() => handleRemoveSkill(i)} className="text-gray-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            placeholder="Add a skill..."
            className="flex-1 rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", outline: "none", color: "var(--text)" }}
          />
          <Button variant="outline" size="sm" onClick={handleAddSkill} className="px-3">
            <Plus size={16} />
          </Button>
        </div>
      </section>

      {/* Experience Section */}
      <section>
        <h3 className="font-semibold text-lg mb-3" style={{ color: "var(--heading)" }}>Experience</h3>
        {data.experience.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No experience extracted.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.experience.map((exp, i) => (
              <textarea
                key={i}
                value={exp}
                onChange={(e) => handleExperienceChange(i, e.target.value)}
                rows={3}
                className="w-full rounded-xl p-3 text-sm resize-y"
                style={{ backgroundColor: "var(--bg-elev)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Education Section */}
      <section>
        <h3 className="font-semibold text-lg mb-3" style={{ color: "var(--heading)" }}>Education</h3>
        {data.education.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No education extracted.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.education.map((edu, i) => (
              <input
                key={i}
                value={edu}
                onChange={(e) => handleEducationChange(i, e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ backgroundColor: "var(--bg-elev)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
