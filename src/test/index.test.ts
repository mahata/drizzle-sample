import { describe, expect, it } from "vitest";
import app from "../index.tsx";

describe("Hello World endpoint", () => {
  it("should return HTML content for GET /", async () => {
    const req = new Request("http://localhost/");
    const res = await app.fetch(req);

    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("<h1>Hello, world!</h1>");
    expect(html).toContain("<title>Drizzle Sample</title>");
  });
});
