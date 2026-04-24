import { describe, it, expect } from "vitest";
import { buildPrompt } from "../src/lib/aiPrompt";
import { SelectedJob, Timeline } from "../src/lib/types";

describe("buildPrompt", () => {
  const sampleProfile = "I am a computer science student with experience in Python and JavaScript.";
  
  const sampleJobs: SelectedJob[] = [
    {
      title: "Software Engineer Intern",
      company: "Tech Corp",
      description: "Build web applications using React and Node.js",
      requiredSkills: ["JavaScript", "React", "Node.js"],
    },
    {
      title: "Data Analyst Intern",
      company: "Data Inc",
      description: "Analyze data and create reports using Python and SQL",
      requiredSkills: ["Python", "SQL", "Data Analysis"],
    },
  ];

  it("should include the user profile in the prompt", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    expect(prompt).toContain(sampleProfile);
  });

  it("should include all selected jobs with titles, companies, descriptions, and skills", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    
    sampleJobs.forEach((job) => {
      expect(prompt).toContain(job.title);
      expect(prompt).toContain(job.company);
      expect(prompt).toContain(job.description);
      job.requiredSkills.forEach((skill) => {
        expect(prompt).toContain(skill);
      });
    });
  });

  it("should include the timeline in the prompt", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    expect(prompt).toContain("4 weeks");
  });

  it("should include education guardrail instructions", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    
    // Check for key guardrail concepts
    expect(prompt).toContain("honest upskilling");
    expect(prompt).toContain("actionable");
    expect(prompt).toContain("proofOfWork");
    expect(prompt).toContain("tangible");
    expect(prompt).toContain("student-friendly");
  });

  it("should request structured JSON output", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    
    expect(prompt).toContain("JSON");
    expect(prompt).toContain("currentReadiness");
    expect(prompt).toContain("projectedReadiness");
    expect(prompt).toContain("learningRoadmap");
    expect(prompt).toContain("prioritySkills");
  });

  it("should specify the correct number of weeks for 2-week timeline", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "2 weeks");
    expect(prompt).toContain("exactly 2 weeks");
  });

  it("should specify the correct number of weeks for 4-week timeline", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    expect(prompt).toContain("exactly 4 weeks");
  });

  it("should specify the correct number of weeks for 8-week timeline", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "8 weeks");
    expect(prompt).toContain("exactly 8 weeks");
  });

  it("should include instructions about proof-of-work requirements", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    
    expect(prompt).toContain("tangible proof of work");
    expect(prompt).toContain("concrete evidence");
    expect(prompt).toContain("verifiable");
  });

  it("should include examples of good and bad proof-of-work items", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    
    // Should include positive examples
    expect(prompt).toContain("Build a working");
    expect(prompt).toContain("GitHub");
    
    // Should include negative examples (what NOT to do)
    expect(prompt).toContain("NOT acceptable");
    expect(prompt).toContain("Study");
    expect(prompt).toContain("Watch tutorials");
  });

  it("should work with different numbers of selected jobs", () => {
    const threeJobs: SelectedJob[] = [
      ...sampleJobs,
      {
        title: "Product Manager Intern",
        company: "Product Co",
        description: "Manage product roadmap",
        requiredSkills: ["Product Management", "Communication"],
      },
    ];

    const prompt = buildPrompt(sampleProfile, threeJobs, "4 weeks");
    
    expect(prompt).toContain("3 jobs selected");
    expect(prompt).toContain("Job 1:");
    expect(prompt).toContain("Job 2:");
    expect(prompt).toContain("Job 3:");
  });

  it("should emphasize avoiding exaggeration of experience", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    
    expect(prompt).toContain("Do NOT exaggerate");
    expect(prompt).toContain("truthfully");
    expect(prompt).toContain("genuine learning");
  });

  it("should request simple language appropriate for students", () => {
    const prompt = buildPrompt(sampleProfile, sampleJobs, "4 weeks");
    
    expect(prompt).toContain("simple");
    expect(prompt).toContain("student-friendly");
    expect(prompt).toContain("early in their career");
  });
});
