import { describe, it, expect } from "vitest";
import { getMockResults } from "../src/lib/mockResults";
import { analysisResultSchema } from "../src/lib/types";

describe("Mock Results", () => {
  it("should return valid AnalysisResult that passes schema validation", () => {
    const mockData = getMockResults();
    
    // Should not throw
    const result = analysisResultSchema.parse(mockData);
    
    // Verify it returns the same object
    expect(result).toEqual(mockData);
  });

  it("should have readiness scores in valid range (0-100)", () => {
    const mockData = getMockResults();
    
    expect(mockData.currentReadiness).toBeGreaterThanOrEqual(0);
    expect(mockData.currentReadiness).toBeLessThanOrEqual(100);
    expect(mockData.projectedReadiness).toBeGreaterThanOrEqual(0);
    expect(mockData.projectedReadiness).toBeLessThanOrEqual(100);
  });

  it("should include all required top-level fields", () => {
    const mockData = getMockResults();
    
    expect(mockData).toHaveProperty("currentReadiness");
    expect(mockData).toHaveProperty("projectedReadiness");
    expect(mockData).toHaveProperty("summary");
    expect(mockData).toHaveProperty("opportunityCoverage");
    expect(mockData).toHaveProperty("commonSkills");
    expect(mockData).toHaveProperty("matchedSkills");
    expect(mockData).toHaveProperty("missingSkills");
    expect(mockData).toHaveProperty("prioritySkills");
    expect(mockData).toHaveProperty("learningRoadmap");
    expect(mockData).toHaveProperty("recommendedCourses");
    expect(mockData).toHaveProperty("portfolioProjects");
    expect(mockData).toHaveProperty("resumeSuggestions");
    expect(mockData).toHaveProperty("mentorStyleAdvice");
  });

  it("should have realistic sample data for student-oriented roles", () => {
    const mockData = getMockResults();
    
    // Check that skills are relevant to internships/entry-level
    expect(mockData.commonSkills).toContain("Data Analysis");
    expect(mockData.missingSkills.length).toBeGreaterThan(0);
    
    // Check roadmap has weeks
    expect(mockData.learningRoadmap.length).toBeGreaterThan(0);
    expect(mockData.learningRoadmap[0]).toHaveProperty("week");
    expect(mockData.learningRoadmap[0]).toHaveProperty("focus");
    expect(mockData.learningRoadmap[0]).toHaveProperty("tasks");
    expect(mockData.learningRoadmap[0]).toHaveProperty("proofOfWork");
    
    // Check priority skills have all required fields
    expect(mockData.prioritySkills.length).toBeGreaterThan(0);
    expect(mockData.prioritySkills[0]).toHaveProperty("skill");
    expect(mockData.prioritySkills[0]).toHaveProperty("priority");
    expect(mockData.prioritySkills[0]).toHaveProperty("appearsIn");
    expect(mockData.prioritySkills[0]).toHaveProperty("reason");
    expect(mockData.prioritySkills[0]).toHaveProperty("recommendedAction");
    
    // Check courses have all required fields
    expect(mockData.recommendedCourses.length).toBeGreaterThan(0);
    expect(mockData.recommendedCourses[0]).toHaveProperty("name");
    expect(mockData.recommendedCourses[0]).toHaveProperty("type");
    expect(mockData.recommendedCourses[0]).toHaveProperty("reason");
    
    // Check projects have all required fields
    expect(mockData.portfolioProjects.length).toBeGreaterThan(0);
    expect(mockData.portfolioProjects[0]).toHaveProperty("title");
    expect(mockData.portfolioProjects[0]).toHaveProperty("description");
    expect(mockData.portfolioProjects[0]).toHaveProperty("skillsDemonstrated");
    
    // Check resume suggestions exist
    expect(mockData.resumeSuggestions.length).toBeGreaterThan(0);
    
    // Check mentor advice exists
    expect(mockData.mentorStyleAdvice).toBeTruthy();
    expect(typeof mockData.mentorStyleAdvice).toBe("string");
  });

  it("should have a 4-week roadmap", () => {
    const mockData = getMockResults();
    
    // Default mock should have 4 weeks
    expect(mockData.learningRoadmap).toHaveLength(4);
    expect(mockData.learningRoadmap[0].week).toBe("Week 1");
    expect(mockData.learningRoadmap[3].week).toBe("Week 4");
  });

  it("should have priority skills with valid priority levels", () => {
    const mockData = getMockResults();
    
    const validPriorities = ["High", "Medium", "Low"];
    mockData.prioritySkills.forEach((skill) => {
      expect(validPriorities).toContain(skill.priority);
    });
  });

  it("should have courses with valid types", () => {
    const mockData = getMockResults();
    
    const validTypes = ["Course", "Certification", "Practice Resource"];
    mockData.recommendedCourses.forEach((course) => {
      expect(validTypes).toContain(course.type);
    });
  });
});
