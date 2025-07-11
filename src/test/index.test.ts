import { describe, expect, it } from "vitest";
import app from "../index";

describe("Hello World endpoint", () => {
  it('should return "Hello, world!" for GET /', async () => {
    const req = new Request("http://localhost/");
    const res = await app.fetch(req);

    expect(res.status).toBe(200);

    const text = await res.text();
    expect(text).toBe("Hello, world!");
  });
});
