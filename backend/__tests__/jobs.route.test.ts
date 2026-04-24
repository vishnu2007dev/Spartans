import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import jobsRouter from "../src/routes/jobs";

// Create a test app
const app = express();
app.use(express.json());
app.use(jobsRouter);

describe("GET /api/jobs/search", () => {
  beforeEach(() => {
    // Set API key for tests
    process.env.RAPIDAPI_KEY = "test-key";
    process.env.RAPIDAPI_HOST = "jsearch.p.rapidapi.com";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 400 when query parameter is missing", async () => {
    const response = await request(app).get("/api/jobs/search");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("Query parameter is required");
  });

  it("should return 400 when query parameter is not a string", async () => {
    const response = await request(app).get("/api/jobs/search?query=");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should accept valid search query", async () => {
    // Mock fetch to return successful response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        status: "OK",
        request_id: "test-123",
        data: [
          {
            job_id: "job-1",
            employer_name: "Test Company",
            job_title: "Software Engineer Intern",
            job_description: "Test description",
            job_employment_type: "INTERN",
            job_country: "US",
          },
        ],
      }),
    });

    const response = await request(app).get(
      "/api/jobs/search?query=Software+Engineer+Intern"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should handle JSearch API errors gracefully", async () => {
    // Mock fetch to throw an error
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const response = await request(app).get(
      "/api/jobs/search?query=Software+Engineer"
    );

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Failed to search jobs");
  });

  it("should pass optional parameters to JSearch API", async () => {
    let capturedUrl = "";

    global.fetch = vi.fn().mockImplementation((url: string) => {
      capturedUrl = url;
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          status: "OK",
          request_id: "test-123",
          data: [],
        }),
      });
    });

    await request(app).get(
      "/api/jobs/search?query=Engineer&page=2&num_pages=3&date_posted=week&remote_jobs_only=true"
    );

    expect(capturedUrl).toContain("query=Engineer");
    expect(capturedUrl).toContain("page=2");
    expect(capturedUrl).toContain("num_pages=3");
    expect(capturedUrl).toContain("date_posted=week");
    expect(capturedUrl).toContain("remote_jobs_only=true");
  });
});

describe("GET /api/jobs/:jobId", () => {
  beforeEach(() => {
    process.env.RAPIDAPI_KEY = "test-key";
    process.env.RAPIDAPI_HOST = "jsearch.p.rapidapi.com";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return job details for valid job ID", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: [
          {
            job_id: "job-123",
            employer_name: "Test Company",
            job_title: "Software Engineer",
            job_description: "Detailed description",
            job_employment_type: "FULLTIME",
            job_country: "US",
          },
        ],
      }),
    });

    const response = await request(app).get("/api/jobs/job-123");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("job_id");
    expect(response.body.job_id).toBe("job-123");
  });

  it("should handle JSearch API errors for job details", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const response = await request(app).get("/api/jobs/job-123");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Failed to fetch job details");
  });
});
