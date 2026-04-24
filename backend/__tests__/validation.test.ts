import { describe, it, expect } from "vitest";
import { validateRequest } from "../src/lib/validation";

describe("validateRequest", () => {
  it("should accept a valid request with 2 selected jobs", () => {
    const validRequest = {
      profile: "I am a computer science student with experience in Python and JavaScript.",
      selectedJobs: [
        {
          title: "Software Engineer Intern",
          company: "Tech Corp",
          description: "Build web applications",
          requiredSkills: ["JavaScript", "React"],
        },
        {
          title: "Data Analyst Intern",
          company: "Data Inc",
          description: "Analyze data and create reports",
          requiredSkills: ["Python", "SQL"],
        },
      ],
      timeline: "4 weeks",
    };

    const result = validateRequest(validRequest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validRequest);
    }
  });

  it("should accept a valid request with 5 selected jobs", () => {
    const validRequest = {
      profile: "Experienced developer",
      selectedJobs: [
        {
          title: "Job 1",
          company: "Company 1",
          description: "Description 1",
          requiredSkills: ["Skill 1"],
        },
        {
          title: "Job 2",
          company: "Company 2",
          description: "Description 2",
          requiredSkills: ["Skill 2"],
        },
        {
          title: "Job 3",
          company: "Company 3",
          description: "Description 3",
          requiredSkills: ["Skill 3"],
        },
        {
          title: "Job 4",
          company: "Company 4",
          description: "Description 4",
          requiredSkills: ["Skill 4"],
        },
        {
          title: "Job 5",
          company: "Company 5",
          description: "Description 5",
          requiredSkills: ["Skill 5"],
        },
      ],
      timeline: "2 weeks",
    };

    const result = validateRequest(validRequest);
    expect(result.success).toBe(true);
  });

  it("should reject a request with empty profile", () => {
    const invalidRequest = {
      profile: "",
      selectedJobs: [
        {
          title: "Software Engineer Intern",
          company: "Tech Corp",
          description: "Build web applications",
          requiredSkills: ["JavaScript"],
        },
        {
          title: "Data Analyst Intern",
          company: "Data Inc",
          description: "Analyze data",
          requiredSkills: ["Python"],
        },
      ],
      timeline: "4 weeks",
    };

    const result = validateRequest(invalidRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("profile");
    }
  });

  it("should reject a request with missing profile", () => {
    const invalidRequest = {
      selectedJobs: [
        {
          title: "Software Engineer Intern",
          company: "Tech Corp",
          description: "Build web applications",
          requiredSkills: ["JavaScript"],
        },
        {
          title: "Data Analyst Intern",
          company: "Data Inc",
          description: "Analyze data",
          requiredSkills: ["Python"],
        },
      ],
      timeline: "4 weeks",
    };

    const result = validateRequest(invalidRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("profile");
    }
  });

  it("should reject a request with only 1 selected job", () => {
    const invalidRequest = {
      profile: "I am a student",
      selectedJobs: [
        {
          title: "Software Engineer Intern",
          company: "Tech Corp",
          description: "Build web applications",
          requiredSkills: ["JavaScript"],
        },
      ],
      timeline: "4 weeks",
    };

    const result = validateRequest(invalidRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("selectedJobs");
    }
  });

  it("should reject a request with 6 selected jobs", () => {
    const invalidRequest = {
      profile: "I am a student",
      selectedJobs: [
        { title: "Job 1", company: "Co 1", description: "Desc 1", requiredSkills: [] },
        { title: "Job 2", company: "Co 2", description: "Desc 2", requiredSkills: [] },
        { title: "Job 3", company: "Co 3", description: "Desc 3", requiredSkills: [] },
        { title: "Job 4", company: "Co 4", description: "Desc 4", requiredSkills: [] },
        { title: "Job 5", company: "Co 5", description: "Desc 5", requiredSkills: [] },
        { title: "Job 6", company: "Co 6", description: "Desc 6", requiredSkills: [] },
      ],
      timeline: "4 weeks",
    };

    const result = validateRequest(invalidRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("selectedJobs");
    }
  });

  it("should reject a request with a selected job missing title", () => {
    const invalidRequest = {
      profile: "I am a student",
      selectedJobs: [
        {
          title: "",
          company: "Tech Corp",
          description: "Build web applications",
          requiredSkills: ["JavaScript"],
        },
        {
          title: "Data Analyst Intern",
          company: "Data Inc",
          description: "Analyze data",
          requiredSkills: ["Python"],
        },
      ],
      timeline: "4 weeks",
    };

    const result = validateRequest(invalidRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("title");
    }
  });

  it("should reject a request with a selected job missing description", () => {
    const invalidRequest = {
      profile: "I am a student",
      selectedJobs: [
        {
          title: "Software Engineer Intern",
          company: "Tech Corp",
          description: "",
          requiredSkills: ["JavaScript"],
        },
        {
          title: "Data Analyst Intern",
          company: "Data Inc",
          description: "Analyze data",
          requiredSkills: ["Python"],
        },
      ],
      timeline: "4 weeks",
    };

    const result = validateRequest(invalidRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("description");
    }
  });

  it("should reject a request with invalid timeline", () => {
    const invalidRequest = {
      profile: "I am a student",
      selectedJobs: [
        {
          title: "Software Engineer Intern",
          company: "Tech Corp",
          description: "Build web applications",
          requiredSkills: ["JavaScript"],
        },
        {
          title: "Data Analyst Intern",
          company: "Data Inc",
          description: "Analyze data",
          requiredSkills: ["Python"],
        },
      ],
      timeline: "6 weeks",
    };

    const result = validateRequest(invalidRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("timeline");
    }
  });

  it("should accept all valid timeline values", () => {
    const baseRequest = {
      profile: "I am a student",
      selectedJobs: [
        {
          title: "Software Engineer Intern",
          company: "Tech Corp",
          description: "Build web applications",
          requiredSkills: ["JavaScript"],
        },
        {
          title: "Data Analyst Intern",
          company: "Data Inc",
          description: "Analyze data",
          requiredSkills: ["Python"],
        },
      ],
    };

    const timelines = ["2 weeks", "4 weeks", "8 weeks"];
    
    timelines.forEach((timeline) => {
      const result = validateRequest({ ...baseRequest, timeline });
      expect(result.success).toBe(true);
    });
  });
});
