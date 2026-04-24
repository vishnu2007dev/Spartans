import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { analyzeRequestSchema } from "../src/lib/types";

describe("Request Validation Property Tests", () => {
  /**
   * Property 1: Valid requests are accepted
   * 
   * **Validates: Requirement 7.1**
   * 
   * For any AnalyzeRequest with a non-empty profile string, 2–5 selectedJobs entries
   * (each containing non-empty title, company, description, and a requiredSkills string array),
   * and a timeline value in {"2 weeks", "4 weeks", "8 weeks"}, the analyzeRequestSchema
   * SHALL parse successfully and return the original values unchanged.
   */
  it("Property 1: Valid requests are accepted", () => {
    // Generator for a valid SelectedJob
    const validSelectedJobArb = fc.record({
      title: fc.string({ minLength: 1, maxLength: 100 }),
      company: fc.string({ minLength: 0, maxLength: 100 }),
      description: fc.string({ minLength: 1, maxLength: 500 }),
      requiredSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 10 }),
    });

    // Generator for a valid AnalyzeRequest
    const validRequestArb = fc.record({
      profile: fc.string({ minLength: 1, maxLength: 2000 }),
      selectedJobs: fc.array(validSelectedJobArb, { minLength: 2, maxLength: 5 }),
      timeline: fc.constantFrom("2 weeks", "4 weeks", "8 weeks"),
    });

    fc.assert(
      fc.property(validRequestArb, (request) => {
        const result = analyzeRequestSchema.safeParse(request);
        
        // The schema should accept the valid request
        expect(result.success).toBe(true);
        
        // The parsed data should match the original request
        if (result.success) {
          expect(result.data).toEqual(request);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: Invalid requests are rejected
   * 
   * **Validates: Requirements 7.2, 7.3, 7.4, 7.5**
   * 
   * For any AnalyzeRequest where the profile is empty/missing, OR selectedJobs has
   * fewer than 2 or more than 5 entries, OR any selectedJobs entry is missing a title
   * or description field, OR timeline is not one of the three valid values, the
   * analyzeRequestSchema SHALL reject the input with a validation error.
   */
  describe("Property 2: Invalid requests are rejected", () => {
    it("rejects requests with empty profile", () => {
      const validSelectedJobArb = fc.record({
        title: fc.string({ minLength: 1, maxLength: 100 }),
        company: fc.string({ minLength: 0, maxLength: 100 }),
        description: fc.string({ minLength: 1, maxLength: 500 }),
        requiredSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      });

      const invalidRequestArb = fc.record({
        profile: fc.constant(""), // Empty profile
        selectedJobs: fc.array(validSelectedJobArb, { minLength: 2, maxLength: 5 }),
        timeline: fc.constantFrom("2 weeks", "4 weeks", "8 weeks"),
      });

      fc.assert(
        fc.property(invalidRequestArb, (request) => {
          const result = analyzeRequestSchema.safeParse(request);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("rejects requests with fewer than 2 selectedJobs", () => {
      const validSelectedJobArb = fc.record({
        title: fc.string({ minLength: 1, maxLength: 100 }),
        company: fc.string({ minLength: 0, maxLength: 100 }),
        description: fc.string({ minLength: 1, maxLength: 500 }),
        requiredSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      });

      const invalidRequestArb = fc.record({
        profile: fc.string({ minLength: 1, maxLength: 2000 }),
        selectedJobs: fc.array(validSelectedJobArb, { minLength: 0, maxLength: 1 }), // 0 or 1 jobs
        timeline: fc.constantFrom("2 weeks", "4 weeks", "8 weeks"),
      });

      fc.assert(
        fc.property(invalidRequestArb, (request) => {
          const result = analyzeRequestSchema.safeParse(request);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("rejects requests with more than 5 selectedJobs", () => {
      const validSelectedJobArb = fc.record({
        title: fc.string({ minLength: 1, maxLength: 100 }),
        company: fc.string({ minLength: 0, maxLength: 100 }),
        description: fc.string({ minLength: 1, maxLength: 500 }),
        requiredSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      });

      const invalidRequestArb = fc.record({
        profile: fc.string({ minLength: 1, maxLength: 2000 }),
        selectedJobs: fc.array(validSelectedJobArb, { minLength: 6, maxLength: 10 }), // 6-10 jobs
        timeline: fc.constantFrom("2 weeks", "4 weeks", "8 weeks"),
      });

      fc.assert(
        fc.property(invalidRequestArb, (request) => {
          const result = analyzeRequestSchema.safeParse(request);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("rejects requests with selectedJobs missing title", () => {
      const invalidSelectedJobArb = fc.record({
        title: fc.constant(""), // Empty title
        company: fc.string({ minLength: 0, maxLength: 100 }),
        description: fc.string({ minLength: 1, maxLength: 500 }),
        requiredSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      });

      const invalidRequestArb = fc.record({
        profile: fc.string({ minLength: 1, maxLength: 2000 }),
        selectedJobs: fc.array(invalidSelectedJobArb, { minLength: 2, maxLength: 5 }),
        timeline: fc.constantFrom("2 weeks", "4 weeks", "8 weeks"),
      });

      fc.assert(
        fc.property(invalidRequestArb, (request) => {
          const result = analyzeRequestSchema.safeParse(request);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("rejects requests with selectedJobs missing description", () => {
      const invalidSelectedJobArb = fc.record({
        title: fc.string({ minLength: 1, maxLength: 100 }),
        company: fc.string({ minLength: 0, maxLength: 100 }),
        description: fc.constant(""), // Empty description
        requiredSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      });

      const invalidRequestArb = fc.record({
        profile: fc.string({ minLength: 1, maxLength: 2000 }),
        selectedJobs: fc.array(invalidSelectedJobArb, { minLength: 2, maxLength: 5 }),
        timeline: fc.constantFrom("2 weeks", "4 weeks", "8 weeks"),
      });

      fc.assert(
        fc.property(invalidRequestArb, (request) => {
          const result = analyzeRequestSchema.safeParse(request);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("rejects requests with invalid timeline", () => {
      const validSelectedJobArb = fc.record({
        title: fc.string({ minLength: 1, maxLength: 100 }),
        company: fc.string({ minLength: 0, maxLength: 100 }),
        description: fc.string({ minLength: 1, maxLength: 500 }),
        requiredSkills: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
      });

      // Generate invalid timeline values (anything except the three valid ones)
      const invalidTimelineArb = fc.string().filter(
        (s) => s !== "2 weeks" && s !== "4 weeks" && s !== "8 weeks"
      );

      const invalidRequestArb = fc.record({
        profile: fc.string({ minLength: 1, maxLength: 2000 }),
        selectedJobs: fc.array(validSelectedJobArb, { minLength: 2, maxLength: 5 }),
        timeline: invalidTimelineArb,
      });

      fc.assert(
        fc.property(invalidRequestArb, (request) => {
          const result = analyzeRequestSchema.safeParse(request);
          expect(result.success).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });
});
