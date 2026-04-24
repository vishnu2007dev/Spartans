import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { analysisResultSchema } from "../src/lib/types";
import { getMockResults } from "../src/lib/mockResults";

describe("Mock Data Fallback Property Tests", () => {
  /**
   * Property 4: Invalid AI response triggers mock data fallback
   * 
   * **Validates: Requirements 9.1, 9.2, 20.2**
   * 
   * For any malformed data that fails analysisResultSchema validation, the system
   * SHALL fall back to getMockResults(), which SHALL always pass analysisResultSchema
   * validation.
   */
  describe("Property 4: Invalid AI response triggers mock data fallback", () => {
    it("malformed data with missing required fields fails schema validation", () => {
      // Generate objects with random fields but missing required AnalysisResult fields
      const malformedDataArb = fc.record({
        // Include some random fields that don't match the schema
        randomField1: fc.anything(),
        randomField2: fc.string(),
        randomField3: fc.integer(),
        // Optionally include some valid fields but not all required ones
        currentReadiness: fc.option(fc.integer(), { nil: undefined }),
        summary: fc.option(fc.string(), { nil: undefined }),
      });

      fc.assert(
        fc.property(malformedDataArb, (malformedData) => {
          // Verify that malformed data fails schema validation
          const result = analysisResultSchema.safeParse(malformedData);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("malformed data with wrong types fails schema validation", () => {
      // Generate data with correct field names but wrong types
      const wrongTypeDataArb = fc.record({
        currentReadiness: fc.string(), // Should be number
        projectedReadiness: fc.string(), // Should be number
        summary: fc.integer(), // Should be string
        opportunityCoverage: fc.string(), // Should be object
        commonSkills: fc.string(), // Should be array
        matchedSkills: fc.integer(), // Should be array
        missingSkills: fc.boolean(), // Should be array
        prioritySkills: fc.string(), // Should be array
        learningRoadmap: fc.integer(), // Should be array
        recommendedCourses: fc.boolean(), // Should be array
        portfolioProjects: fc.string(), // Should be array
        resumeSuggestions: fc.integer(), // Should be array
        mentorStyleAdvice: fc.boolean(), // Should be string
      });

      fc.assert(
        fc.property(wrongTypeDataArb, (wrongTypeData) => {
          // Verify that wrong-type data fails schema validation
          const result = analysisResultSchema.safeParse(wrongTypeData);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("malformed data with out-of-range readiness scores fails schema validation", () => {
      // Generate data with readiness scores outside [0, 100]
      const outOfRangeArb = fc.record({
        currentReadiness: fc.integer().filter(n => n < 0 || n > 100),
        projectedReadiness: fc.integer().filter(n => n < 0 || n > 100),
        summary: fc.string({ minLength: 1 }),
        opportunityCoverage: fc.record({
          current: fc.string({ minLength: 1 }),
          projected: fc.string({ minLength: 1 }),
          explanation: fc.string({ minLength: 1 }),
        }),
        commonSkills: fc.array(fc.string()),
        matchedSkills: fc.array(fc.string()),
        missingSkills: fc.array(fc.string()),
        prioritySkills: fc.array(fc.record({
          skill: fc.string({ minLength: 1 }),
          priority: fc.constantFrom("High", "Medium", "Low"),
          appearsIn: fc.string({ minLength: 1 }),
          reason: fc.string({ minLength: 1 }),
          recommendedAction: fc.string({ minLength: 1 }),
        })),
        learningRoadmap: fc.array(fc.record({
          week: fc.string({ minLength: 1 }),
          focus: fc.string({ minLength: 1 }),
          tasks: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
          proofOfWork: fc.string({ minLength: 1 }),
        }), { minLength: 1 }),
        recommendedCourses: fc.array(fc.record({
          name: fc.string({ minLength: 1 }),
          type: fc.constantFrom("Course", "Certification", "Practice Resource"),
          reason: fc.string({ minLength: 1 }),
        })),
        portfolioProjects: fc.array(fc.record({
          title: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
          skillsDemonstrated: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
        })),
        resumeSuggestions: fc.array(fc.string()),
        mentorStyleAdvice: fc.string({ minLength: 1 }),
      });

      fc.assert(
        fc.property(outOfRangeArb, (outOfRangeData) => {
          // Verify that out-of-range data fails schema validation
          const result = analysisResultSchema.safeParse(outOfRangeData);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("malformed data with invalid enum values fails schema validation", () => {
      // Generate data with invalid enum values for priority and course type
      const invalidEnumArb = fc.record({
        currentReadiness: fc.integer({ min: 0, max: 100 }),
        projectedReadiness: fc.integer({ min: 0, max: 100 }),
        summary: fc.string({ minLength: 1 }),
        opportunityCoverage: fc.record({
          current: fc.string({ minLength: 1 }),
          projected: fc.string({ minLength: 1 }),
          explanation: fc.string({ minLength: 1 }),
        }),
        commonSkills: fc.array(fc.string()),
        matchedSkills: fc.array(fc.string()),
        missingSkills: fc.array(fc.string()),
        prioritySkills: fc.array(fc.record({
          skill: fc.string({ minLength: 1 }),
          priority: fc.string().filter(s => s !== "High" && s !== "Medium" && s !== "Low"), // Invalid priority
          appearsIn: fc.string({ minLength: 1 }),
          reason: fc.string({ minLength: 1 }),
          recommendedAction: fc.string({ minLength: 1 }),
        }), { minLength: 1 }),
        learningRoadmap: fc.array(fc.record({
          week: fc.string({ minLength: 1 }),
          focus: fc.string({ minLength: 1 }),
          tasks: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
          proofOfWork: fc.string({ minLength: 1 }),
        }), { minLength: 1 }),
        recommendedCourses: fc.array(fc.record({
          name: fc.string({ minLength: 1 }),
          type: fc.string().filter(s => s !== "Course" && s !== "Certification" && s !== "Practice Resource"), // Invalid type
          reason: fc.string({ minLength: 1 }),
        }), { minLength: 1 }),
        portfolioProjects: fc.array(fc.record({
          title: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
          skillsDemonstrated: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
        })),
        resumeSuggestions: fc.array(fc.string()),
        mentorStyleAdvice: fc.string({ minLength: 1 }),
      });

      fc.assert(
        fc.property(invalidEnumArb, (invalidEnumData) => {
          // Verify that invalid enum data fails schema validation
          const result = analysisResultSchema.safeParse(invalidEnumData);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("malformed data with null values fails schema validation", () => {
      // Generate data with null values instead of proper types
      const nullValueArb = fc.record({
        currentReadiness: fc.constant(null), // null instead of number
        projectedReadiness: fc.integer({ min: 0, max: 100 }),
        summary: fc.string(),
        opportunityCoverage: fc.record({
          current: fc.string(),
          projected: fc.string(),
          explanation: fc.string(),
        }),
        commonSkills: fc.array(fc.string()),
        matchedSkills: fc.array(fc.string()),
        missingSkills: fc.array(fc.string()),
        prioritySkills: fc.array(fc.record({
          skill: fc.string(),
          priority: fc.constantFrom("High", "Medium", "Low"),
          appearsIn: fc.string(),
          reason: fc.string(),
          recommendedAction: fc.string(),
        })),
        learningRoadmap: fc.array(fc.record({
          week: fc.string(),
          focus: fc.string(),
          tasks: fc.array(fc.string()),
          proofOfWork: fc.string(),
        })),
        recommendedCourses: fc.array(fc.record({
          name: fc.string(),
          type: fc.constantFrom("Course", "Certification", "Practice Resource"),
          reason: fc.string(),
        })),
        portfolioProjects: fc.array(fc.record({
          title: fc.string(),
          description: fc.string(),
          skillsDemonstrated: fc.array(fc.string()),
        })),
        resumeSuggestions: fc.array(fc.string()),
        mentorStyleAdvice: fc.string(),
      });

      fc.assert(
        fc.property(nullValueArb, (nullValueData) => {
          // Verify that null value data fails schema validation
          const result = analysisResultSchema.safeParse(nullValueData);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("malformed data with undefined values fails schema validation", () => {
      // Generate data with undefined values for required fields
      const undefinedValueArb = fc.record({
        currentReadiness: fc.integer({ min: 0, max: 100 }),
        projectedReadiness: fc.integer({ min: 0, max: 100 }),
        summary: fc.string(),
        opportunityCoverage: fc.constant(undefined), // undefined instead of object
        commonSkills: fc.array(fc.string()),
        matchedSkills: fc.array(fc.string()),
        missingSkills: fc.array(fc.string()),
        prioritySkills: fc.array(fc.record({
          skill: fc.string(),
          priority: fc.constantFrom("High", "Medium", "Low"),
          appearsIn: fc.string(),
          reason: fc.string(),
          recommendedAction: fc.string(),
        })),
        learningRoadmap: fc.array(fc.record({
          week: fc.string(),
          focus: fc.string(),
          tasks: fc.array(fc.string()),
          proofOfWork: fc.string(),
        })),
        recommendedCourses: fc.array(fc.record({
          name: fc.string(),
          type: fc.constantFrom("Course", "Certification", "Practice Resource"),
          reason: fc.string(),
        })),
        portfolioProjects: fc.array(fc.record({
          title: fc.string(),
          description: fc.string(),
          skillsDemonstrated: fc.array(fc.string()),
        })),
        resumeSuggestions: fc.array(fc.string()),
        mentorStyleAdvice: fc.string(),
      });

      fc.assert(
        fc.property(undefinedValueArb, (undefinedValueData) => {
          // Verify that undefined value data fails schema validation
          const result = analysisResultSchema.safeParse(undefinedValueData);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("getMockResults() always passes schema validation", () => {
      // Test that getMockResults() consistently returns valid data
      fc.assert(
        fc.property(fc.constant(null), () => {
          // Get mock results
          const mockResults = getMockResults();
          
          // Verify that mock results pass schema validation
          const result = analysisResultSchema.safeParse(mockResults);
          expect(result.success).toBe(true);
          
          // Verify the data matches what was returned
          if (result.success) {
            expect(result.data).toEqual(mockResults);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});
