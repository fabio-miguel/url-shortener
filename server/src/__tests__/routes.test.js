const request = require("supertest");
const { app, server } = require("../server");

describe("URL routes", () => {
  it("should return a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("URL Shortener API is running");
  });
});

it("should return a shortened URL", async () => {
  const res = await request(app)
    .post("/url")
    .send({ longUrl: "http://www.longurlexample.com" });

  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty("shortenedURL");
  expect(res.body.originalURL).toEqual("http://www.longurlexample.com");
});

afterAll(async () => {
  // Close the server
  await server.close();
});
