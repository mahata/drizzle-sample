import { describe, expect, it } from "vitest";
import app from "../index.tsx";

describe("Interactive Message App", () => {
  it("should return HTML form for GET /", async () => {
    const req = new Request("http://localhost/");
    const res = await app.fetch(req);

    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("<title>Interactive Message App</title>");
    expect(html).toContain('<form id="messageForm"');
    expect(html).toContain('<input type="text" id="messageInput"');
    expect(html).toContain('<button type="submit">Submit</button>');
    expect(html).toContain("No messages yet");
  });

  it("should handle form submission on POST /submit", async () => {
    const formData = new FormData();
    formData.append("message", "Test message");

    const req = new Request("http://localhost/submit", {
      method: "POST",
      body: formData,
    });
    const res = await app.fetch(req);

    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("Messages:");
    expect(html).toContain("Test message");
  });

  it("should accumulate multiple messages", async () => {
    // Submit first message
    const formData1 = new FormData();
    formData1.append("message", "First message");

    const req1 = new Request("http://localhost/submit", {
      method: "POST",
      body: formData1,
    });
    await app.fetch(req1);

    // Submit second message
    const formData2 = new FormData();
    formData2.append("message", "Second message");

    const req2 = new Request("http://localhost/submit", {
      method: "POST",
      body: formData2,
    });
    const res2 = await app.fetch(req2);

    expect(res2.status).toBe(200);

    const html = await res2.text();
    expect(html).toContain("First message");
    expect(html).toContain("Second message");
  });
});
