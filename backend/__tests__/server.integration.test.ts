import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/server";

describe("Server Integration", () => {
  it("should have /health endpoint", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("should have /api/analyze endpoint", async () => {
    // Send an invalid request to verify the endpoint exists
    const response = await request(app)
      .post("/api/analyze")
      .send({});

    // Should return 400 for invalid request, not 404
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return mock data for valid request when API key is not set", async () => {
    const validRequest = {
      profile: "I am a student with Python experience.",
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
          description: "Analyze data",
          requiredSkills: ["Python", "SQL"],
        },
      ],
      timeline: "4 weeks",
    };

    const response = await request(app)
      .post("/api/analyze")
      .send(validRequest);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentReadiness");
    expect(response.body).toHaveProperty("projectedReadiness");
    expect(response.body).toHaveProperty("summary");
    expect(response.body).toHaveProperty("learningRoadmap");
    expect(response.body).toHaveProperty("prioritySkills");
    expect(response.body).toHaveProperty("recommendedCourses");
    expect(response.body).toHaveProperty("portfolioProjects");
    expect(response.body).toHaveProperty("resumeSuggestions");
    expect(response.body).toHaveProperty("mentorStyleAdvice");
  });
});
