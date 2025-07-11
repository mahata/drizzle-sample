import { describe, expect, it } from "vitest";
import app from "../index.tsx";

describe("Interactive Form Application", () => {
  it("should return HTML form for GET /", async () => {
    const req = new Request("http://localhost/");
    const res = await app.fetch(req);

    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("<title>Drizzle Sample - Interactive Form</title>");
    expect(html).toContain("Interactive Message Form");
    expect(html).toContain('id="messageForm"');
    expect(html).toContain('id="messageText"');
    expect(html).toContain("Submit Message");
    expect(html).toContain("No messages yet");
  });

  it("should handle message submission via POST /message", async () => {
    // First, get a session by making a GET request
    const getReq = new Request("http://localhost/");
    const getRes = await app.fetch(getReq);

    // Extract session cookie
    const setCookie = getRes.headers.get("set-cookie");
    expect(setCookie).toContain("sessionId=");

    // Submit a message
    const postReq = new Request("http://localhost/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: setCookie || "",
      },
      body: JSON.stringify({ message: "Test message" }),
    });

    const postRes = await app.fetch(postReq);
    expect(postRes.status).toBe(200);

    const response = await postRes.json();
    expect(response.success).toBe(true);
    expect(response.message).toBe("Test message");
    expect(response.messages).toContain("Test message");
  });

  it("should reject empty messages", async () => {
    const req = new Request("http://localhost/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "" }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);

    const response = await res.json();
    expect(response.error).toBe("Message cannot be empty");
  });

  it("should reject invalid message format", async () => {
    const req = new Request("http://localhost/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: null }),
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);

    const response = await res.json();
    expect(response.error).toBe("Invalid message");
  });
});
