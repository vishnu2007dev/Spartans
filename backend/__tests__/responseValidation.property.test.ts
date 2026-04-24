import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { analysisResultSchema, type AnalysisResult } from "../src/lib/types";

describe("Response Validation Property Tests", () => {
  /**
   * Property 3: AI response parsing round-trip
   * 
   * **Validates: Requirement 8.2**
   * 
   * For any valid AnalysisResult object, when serialized to JSON and then parsed
   * through analysisResultSchema, the parsed result SHALL be equivalent to the
   * original object.
   */
  it("Property 3: AI response parsing round-trip", () => {
    // Generator for valid PrioritySkill
    const prioritySkillArb = fc.record({
      skill: fc.string({ minLength: 1, maxLength: 50 }),
      priority: fc.constantFrom("High", "Medium", "Low"),
      appearsIn: fc.string({ minLength: 1, maxLength: 100 }),
      reason: fc.string({ minLength: 1, maxLength: 200 }),
      recommendedAction: fc.string({ minLength: 1, maxLength: 200 }),
    });

    // Generator for valid RoadmapWeek
    const roadmapWeekArb = fc.record({
      week: fc.string({ minLength: 1, maxLength: 20 }),
      focus: fc.string({ minLength: 1, maxLength: 100 }),
      tasks: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 10 }),
      proofOfWork: fc.string({ minLength: 1, maxLength: 200 }),
    });

    // Generator for valid Course
    const courseArb = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }),
      type: fc.constantFrom("Course", "Certification", "Practice Resource"),
      reason: fc.string({ minLength: 1, maxLength: 200 }),
    });

    // Generator for valid PortfolioProject
    const portfolioProjectArb = fc.record({
      title: fc.string({ minLength: 1, maxLength: 100 }),
      description: fc.string({ minLength: 1, maxLength: 500 }),
      skillsDemonstrated: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
    });

    // Generator for valid AnalysisResult
    const validAnalysisResultArb = fc.record({
      currentReadiness: fc.integer({ min: 0, max: 100 }),
      projectedReadiness: fc.integer({ min: 0, max: 100 }),
      summary: fc.string({ minLength: 1, maxLength: 1000 }),
      opportunityCoverage: fc.record({
        current: fc.string({ minLength: 1, maxLength: 100 }),
        projected: fc.string({ minLength: 1, maxLength: 100 }),
        explanation: fc.string({ minLength: 1, maxLength: 500 }),
      }),
      commonSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 20 }),
      matchedSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 20 }),
      missingSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 20 }),
      prioritySkills: fc.array(prioritySkillArb, { minLength: 0, maxLength: 10 }),
      learningRoadmap: fc.array(roadmapWeekArb, { minLength: 1, maxLength: 12 }),
      recommendedCourses: fc.array(courseArb, { minLength: 0, maxLength: 10 }),
      portfolioProjects: fc.array(portfolioProjectArb, { minLength: 0, maxLength: 5 }),
      resumeSuggestions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 0, maxLength: 10 }),
      mentorStyleAdvice: fc.string({ minLength: 1, maxLength: 1000 }),
    });

    fc.assert(
      fc.property(validAnalysisResultArb, (analysisResult) => {
        // Serialize to JSON
        const jsonString = JSON.stringify(analysisResult);
        
        // Parse back from JSON
        const parsedJson = JSON.parse(jsonString);
        
        // Validate through schema
        const result = analysisResultSchema.safeParse(parsedJson);
        
        // The schema should accept the valid result
        expect(result.success).toBe(true);
        
        // The parsed data should match the original
        if (result.success) {
          expect(result.data).toEqual(analysisResult);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5: AI response schema completeness
   * 
   * **Validates: Requirement 20.1**
   * 
   * For each required top-level field in AnalysisResult, when that field is removed
   * from an otherwise valid AnalysisResult object, the analysisResultSchema SHALL
   * reject the input with a validation error.
   */
  describe("Property 5: AI response schema completeness", () => {
    // Helper to create a valid AnalysisResult for testing
    const createValidAnalysisResult = (): AnalysisResult => ({
      currentReadiness: 50,
      projectedReadiness: 75,
      summary: "Test summary",
      opportunityCoverage: {
        current: "2/5 jobs",
        projected: "4/5 jobs",
        explanation: "Test explanation",
      },
      commonSkills: ["JavaScript", "React"],
      matchedSkills: ["TypeScript"],
      missingSkills: ["Python"],
      prioritySkills: [
        {
          skill: "Python",
          priority: "High",
          appearsIn: "3/5 jobs",
          reason: "Highly demanded",
          recommendedAction: "Take a course",
        },
      ],
      learningRoadmap: [
        {
          week: "Week 1",
          focus: "Python basics",
          tasks: ["Learn syntax", "Build project"],
          proofOfWork: "GitHub repo",
        },
      ],
      recommendedCourses: [
        {
          name: "Python for Beginners",
          type: "Course",
          reason: "Covers fundamentals",
        },
      ],
      portfolioProjects: [
        {
          title: "Todo App",
          description: "A simple todo application",
          skillsDemonstrated: ["Python", "Flask"],
        },
      ],
      resumeSuggestions: ["Add Python projects"],
      mentorStyleAdvice: "Focus on practical projects",
    });

    const requiredFields: (keyof AnalysisResult)[] = [
      "currentReadiness",
      "projectedReadiness",
      "summary",
      "opportunityCoverage",
      "commonSkills",
      "matchedSkills",
      "missingSkills",
      "prioritySkills",
      "learningRoadmap",
      "recommendedCourses",
      "portfolioProjects",
      "resumeSuggestions",
      "mentorStyleAdvice",
    ];

    requiredFields.forEach((field) => {
      it(`rejects AnalysisResult missing ${field}`, () => {
        fc.assert(
          fc.property(fc.constant(null), () => {
            const validResult = createValidAnalysisResult();
            
            // Remove the field
            const invalidResult = { ...validResult };
            delete (invalidResult as any)[field];
            
            // Validate through schema
            const result = analysisResultSchema.safeParse(invalidResult);
            
            // The schema should reject the incomplete result
            expect(result.success).toBe(false);
          }),
          { numRuns: 100 }
        );
      });
    });
  });

  /**
   * Property 6: Readiness score range enforcement
   * 
   * **Validates: Requirement 20.3**
   * 
   * For any AnalysisResult where currentReadiness or projectedReadiness is outside
   * the range [0, 100], the analysisResultSchema SHALL reject the input with a
   * validation error.
   */
  describe("Property 6: Readiness score range enforcement", () => {
    // Helper to create a valid AnalysisResult for testing
    const createValidAnalysisResult = (): AnalysisResult => ({
      currentReadiness: 50,
      projectedReadiness: 75,
      summary: "Test summary",
      opportunityCoverage: {
        current: "2/5 jobs",
        projected: "4/5 jobs",
        explanation: "Test explanation",
      },
      commonSkills: ["JavaScript", "React"],
      matchedSkills: ["TypeScript"],
      missingSkills: ["Python"],
      prioritySkills: [
        {
          skill: "Python",
          priority: "High",
          appearsIn: "3/5 jobs",
          reason: "Highly demanded",
          recommendedAction: "Take a course",
        },
      ],
      learningRoadmap: [
        {
          week: "Week 1",
          focus: "Python basics",
          tasks: ["Learn syntax", "Build project"],
          proofOfWork: "GitHub repo",
        },
      ],
      recommendedCourses: [
        {
          name: "Python for Beginners",
          type: "Course",
          reason: "Covers fundamentals",
        },
      ],
      portfolioProjects: [
        {
          title: "Todo App",
          description: "A simple todo application",
          skillsDemonstrated: ["Python", "Flask"],
        },
      ],
      resumeSuggestions: ["Add Python projects"],
      mentorStyleAdvice: "Focus on practical projects",
    });

    it("rejects currentReadiness below 0", () => {
      // Generate numbers less than 0
      const belowRangeArb = fc.integer({ max: -1 });

      fc.assert(
        fc.property(belowRangeArb, (invalidScore) => {
          const invalidResult = {
            ...createValidAnalysisResult(),
            currentReadiness: invalidScore,
          };

          const result = analysisResultSchema.safeParse(invalidResult);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("rejects currentReadiness above 100", () => {
      // Generate numbers greater than 100
      const aboveRangeArb = fc.integer({ min: 101 });

      fc.assert(
        fc.property(aboveRangeArb, (invalidScore) => {
          const invalidResult = {
            ...createValidAnalysisResult(),
            currentReadiness: invalidScore,
          };

          const result = analysisResultSchema.safeParse(invalidResult);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("rejects projectedReadiness below 0", () => {
      // Generate numbers less than 0
      const belowRangeArb = fc.integer({ max: -1 });

      fc.assert(
        fc.property(belowRangeArb, (invalidScore) => {
          const invalidResult = {
            ...createValidAnalysisResult(),
            projectedReadiness: invalidScore,
          };

          const result = analysisResultSchema.safeParse(invalidResult);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("rejects projectedReadiness above 100", () => {
      // Generate numbers greater than 100
      const aboveRangeArb = fc.integer({ min: 101 });

      fc.assert(
        fc.property(aboveRangeArb, (invalidScore) => {
          const invalidResult = {
            ...createValidAnalysisResult(),
            projectedReadiness: invalidScore,
          };

          const result = analysisResultSchema.safeParse(invalidResult);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("accepts readiness scores at boundaries (0 and 100)", () => {
      const boundaryScoreArb = fc.constantFrom(0, 100);

      fc.assert(
        fc.property(boundaryScoreArb, boundaryScoreArb, (currentScore, projectedScore) => {
          const validResult = {
            ...createValidAnalysisResult(),
            currentReadiness: currentScore,
            projectedReadiness: projectedScore,
          };

          const result = analysisResultSchema.safeParse(validResult);
          expect(result.success).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });
});
