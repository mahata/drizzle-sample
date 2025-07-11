import { Hono } from "hono";

const app = new Hono();

// In-memory storage for messages during the session
const messages: string[] = [];

// Root page with form
app.get("/", (c) => {
  return c.html(
    <html lang="en">
      <head>
        <title>Interactive Message App</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .form-container { margin-bottom: 30px; }
            input[type="text"] { width: 300px; padding: 8px; margin-right: 10px; }
            button { padding: 8px 16px; cursor: pointer; }
            .messages { border: 1px solid #ccc; padding: 15px; min-height: 100px; background-color: #f9f9f9; }
            .message { margin-bottom: 5px; padding: 5px; background-color: white; border-radius: 3px; }
          `,
          }}
        />
      </head>
      <body>
        <h1>Interactive Message App</h1>
        <div class="form-container">
          <form
            id="messageForm"
            method="post"
            action="/submit"
            onsubmit="return handleSubmit(event);"
          >
            <input
              type="text"
              id="messageInput"
              name="message"
              placeholder="Enter your message..."
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div class="messages" id="messagesArea">
          <h3>Messages:</h3>
          {messages.length === 0 ? (
            <p>No messages yet. Submit a message above!</p>
          ) : (
            messages.map((message, index) => (
              <div key={`msg-${index}-${message.slice(0, 10)}`} class="message">
                {message}
              </div>
            ))
          )}
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            async function handleSubmit(event) {
              event.preventDefault();
              console.log('Form submitted via AJAX');
              
              const input = document.getElementById('messageInput');
              const message = input.value.trim();
              
              if (!message) return false;
              
              try {
                const response = await fetch('/submit', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: 'message=' + encodeURIComponent(message)
                });
                
                if (response.ok) {
                  const newMessagesHtml = await response.text();
                  document.getElementById('messagesArea').innerHTML = newMessagesHtml;
                  input.value = '';
                }
              } catch (error) {
                console.error('Error submitting message:', error);
              }
              
              return false;
            }
          `,
          }}
        />
      </body>
    </html>,
  );
});

// Handle form submission
app.post("/submit", async (c) => {
  const body = await c.req.formData();
  const message = body.get("message") as string;

  if (message?.trim()) {
    messages.push(message.trim());
  }

  // Return just the messages area HTML
  return c.html(
    <div>
      <h3>Messages:</h3>
      {messages.length === 0 ? (
        <p>No messages yet. Submit a message above!</p>
      ) : (
        messages.map((message, index) => (
          <div key={`msg-${index}-${message.slice(0, 10)}`} class="message">
            {message}
          </div>
        ))
      )}
    </div>,
  );
});

export default app;
