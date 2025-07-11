import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    <html>
      <head>
        <title>Drizzle Sample</title>
      </head>
      <body>
        <h1>Hello, world!</h1>
      </body>
    </html>
  );
});

export default app;
