"use client";

import { useState } from "react";
import type { ParsedResume, ParsedExperience, ParsedEducation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { X, Plus, ChevronDown, ChevronRight, Briefcase, GraduationCap, Sparkles } from "lucide-react";

interface ParsedDataEditorProps {
  data: ParsedResume;
  onChange: (newData: ParsedResume) => void;
}

function Section({ title, icon: Icon, children, defaultOpen = true }: any) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-6 border rounded-xl overflow-hidden bg-white shadow-sm" style={{ borderColor: "var(--border)" }}>
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold" style={{ color: "var(--heading)" }}>
          <Icon size={18} className="text-gray-500" />
          {title}
        </div>
        {open ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
      </button>
      {open && <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>{children}</div>}
    </div>
  );
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

  // Experience handlers
  const updateExperience = (index: number, field: keyof ParsedExperience, val: string) => {
    const updated = [...data.experience];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, experience: updated });
  };
  const updateExperienceHighlight = (expIndex: number, hlIndex: number, val: string) => {
    const updated = [...data.experience];
    const newHighlights = [...updated[expIndex].highlights];
    newHighlights[hlIndex] = val;
    updated[expIndex] = { ...updated[expIndex], highlights: newHighlights };
    onChange({ ...data, experience: updated });
  };
  const addExperienceHighlight = (expIndex: number) => {
    const updated = [...data.experience];
    updated[expIndex] = { ...updated[expIndex], highlights: [...updated[expIndex].highlights, ""] };
    onChange({ ...data, experience: updated });
  };
  const removeExperienceHighlight = (expIndex: number, hlIndex: number) => {
    const updated = [...data.experience];
    const newHighlights = [...updated[expIndex].highlights];
    newHighlights.splice(hlIndex, 1);
    updated[expIndex] = { ...updated[expIndex], highlights: newHighlights };
    onChange({ ...data, experience: updated });
  };

  // Education handlers
  const updateEducation = (index: number, field: keyof ParsedEducation, val: string) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, education: updated });
  };

  return (
    <div className="flex flex-col w-full h-full pb-8">
      {/* Skills Section */}
      <Section title={`Skills (${data.skills.length})`} icon={Sparkles}>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.skills.map((skill, i) => (
            <div 
              key={i} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
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
            placeholder="Add a new skill..."
            className="flex-1 rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-black outline-none transition-all"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          />
          <Button variant="outline" size="sm" onClick={handleAddSkill} className="px-3">
            <Plus size={16} />
          </Button>
        </div>
      </Section>

      {/* Experience Section */}
      <Section title={`Experience (${data.experience?.length || 0})`} icon={Briefcase}>
        {!data.experience || data.experience.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No experience extracted.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {data.experience.map((exp, i) => (
              <div key={i} className="flex flex-col gap-3 relative">
                {i > 0 && <hr className="my-2 border-gray-200" />}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Company</label>
                    <input
                      value={exp.company}
                      onChange={(e) => updateExperience(i, "company", e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Title</label>
                    <input
                      value={exp.title}
                      onChange={(e) => updateExperience(i, "title", e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Dates</label>
                  <input
                    value={exp.dates}
                    onChange={(e) => updateExperience(i, "dates", e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-black outline-none"
                    placeholder="e.g. Jan 2020 - Present"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wider">Highlights</label>
                  <div className="flex flex-col gap-2">
                    {exp.highlights?.map((hl, hlIndex) => (
                      <div key={hlIndex} className="flex gap-2 items-start">
                        <span className="text-gray-400 mt-2">•</span>
                        <textarea
                          value={hl}
                          onChange={(e) => updateExperienceHighlight(i, hlIndex, e.target.value)}
                          className="flex-1 rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-black outline-none resize-none"
                          rows={2}
                        />
                        <button 
                          onClick={() => removeExperienceHighlight(i, hlIndex)}
                          className="mt-2 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addExperienceHighlight(i)}
                      className="text-sm font-medium flex items-center gap-1 text-gray-500 hover:text-black self-start mt-1"
                    >
                      <Plus size={14} /> Add bullet
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Education Section */}
      <Section title={`Education (${data.education?.length || 0})`} icon={GraduationCap} defaultOpen={false}>
        {!data.education || data.education.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No education extracted.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {data.education.map((edu, i) => (
              <div key={i} className="flex flex-col gap-3">
                {i > 0 && <hr className="my-2 border-gray-200" />}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Institution</label>
                  <input
                    value={edu.institution}
                    onChange={(e) => updateEducation(i, "institution", e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Degree</label>
                    <input
                      value={edu.degree}
                      onChange={(e) => updateEducation(i, "degree", e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Year</label>
                    <input
                      value={edu.year}
                      onChange={(e) => updateEducation(i, "year", e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
