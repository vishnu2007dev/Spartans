import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import analyzeRouter from "../src/routes/analyze";
import { getMockResults } from "../src/lib/mockResults";

// Create a test app
const app = express();
app.use(express.json());
app.use(analyzeRouter);

describe("POST /api/analyze", () => {
  const validRequest = {
    profile: "I am a computer science student with experience in Python and JavaScript.",
    selectedJobs: [
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
        requiredSkills: ["Python", "SQL", "Excel"],
      },
    ],
    timeline: "4 weeks",
  };

  beforeEach(() => {
    // Clear any environment variables
    delete process.env.OPENROUTER_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 400 for empty profile", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .send({ ...validRequest, profile: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("profile");
  });

  it("should return 400 for missing profile", async () => {
    const { profile, ...requestWithoutProfile } = validRequest;
    const response = await request(app)
      .post("/api/analyze")
      .send(requestWithoutProfile);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 for fewer than 2 selected jobs", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .send({
        ...validRequest,
        selectedJobs: [validRequest.selectedJobs[0]],
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("selectedJobs");
  });

  it("should return 400 for more than 5 selected jobs", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .send({
        ...validRequest,
        selectedJobs: [
          ...validRequest.selectedJobs,
          { title: "Job 3", company: "Co 3", description: "Desc 3", requiredSkills: [] },
          { title: "Job 4", company: "Co 4", description: "Desc 4", requiredSkills: [] },
          { title: "Job 5", company: "Co 5", description: "Desc 5", requiredSkills: [] },
          { title: "Job 6", company: "Co 6", description: "Desc 6", requiredSkills: [] },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 for selected job missing title", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .send({
        ...validRequest,
        selectedJobs: [
          { ...validRequest.selectedJobs[0], title: "" },
          validRequest.selectedJobs[1],
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 for selected job missing description", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .send({
        ...validRequest,
        selectedJobs: [
          { ...validRequest.selectedJobs[0], description: "" },
          validRequest.selectedJobs[1],
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 for invalid timeline", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .send({
        ...validRequest,
        timeline: "6 weeks",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("timeline");
  });

  it("should return mock data when OPENROUTER_API_KEY is not set", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .send(validRequest);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentReadiness");
    expect(response.body).toHaveProperty("projectedReadiness");
    expect(response.body).toHaveProperty("summary");
    expect(response.body).toHaveProperty("learningRoadmap");
    
    // Verify it matches mock data structure
    const mockData = getMockResults();
    expect(response.body.currentReadiness).toBe(mockData.currentReadiness);
  });

  it("should return mock data when OpenRouter API fails", async () => {
    // Set API key but mock fetch to fail
    process.env.OPENROUTER_API_KEY = "test-key";
    
    // Mock fetch to throw an error
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const response = await request(app)
      .post("/api/analyze")
      .send(validRequest);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentReadiness");
    expect(response.body).toHaveProperty("projectedReadiness");
  });

  it("should return mock data when OpenRouter API returns non-200 status", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    
    // Mock fetch to return non-200 status
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const response = await request(app)
      .post("/api/analyze")
      .send(validRequest);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentReadiness");
  });

  it("should return mock data when OpenRouter API returns invalid JSON", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    
    // Mock fetch to return invalid JSON in content
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: "This is not valid JSON",
            },
          },
        ],
      }),
    });

    const response = await request(app)
      .post("/api/analyze")
      .send(validRequest);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentReadiness");
  });

  it("should return mock data when AI response fails schema validation", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    
    // Mock fetch to return JSON that doesn't match schema
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                currentReadiness: 50,
                // Missing required fields
              }),
            },
          },
        ],
      }),
    });

    const response = await request(app)
      .post("/api/analyze")
      .send(validRequest);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentReadiness");
    expect(response.body).toHaveProperty("projectedReadiness");
    expect(response.body).toHaveProperty("learningRoadmap");
  });

  it("should accept valid request with 2 weeks timeline", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .send({ ...validRequest, timeline: "2 weeks" });

    expect(response.status).toBe(200);
  });

  it("should accept valid request with 8 weeks timeline", async () => {
    const response = await request(app)
      .post("/api/analyze")
      .send({ ...validRequest, timeline: "8 weeks" });

    expect(response.status).toBe(200);
  });
});
