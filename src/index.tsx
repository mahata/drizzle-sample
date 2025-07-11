import type { Context } from "hono";
import { Hono } from "hono";

// In-memory storage for messages per session
const sessionMessages = new Map<string, string[]>();

const app = new Hono();

// Generate simple session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Get or create session
function getSession(c: Context): string {
  const sessionCookie = c.req
    .header("cookie")
    ?.split(";")
    .find((cookie: string) => cookie.trim().startsWith("sessionId="));

  if (sessionCookie) {
    const sessionId = sessionCookie.split("=")[1];
    if (sessionId && sessionMessages.has(sessionId)) {
      return sessionId;
    }
  }

  const newSessionId = generateSessionId();
  sessionMessages.set(newSessionId, []);
  return newSessionId;
}

// Main page component
function MainPage({ messages }: { messages: string[]; sessionId: string }) {
  return (
    <html lang="en">
      <head>
        <title>Drizzle Sample - Interactive Form</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          .container {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          input[type="text"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
          }
          button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
          }
          button:hover {
            background: #0056b3;
          }
          .messages {
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            min-height: 100px;
          }
          .message {
            padding: 8px;
            margin-bottom: 8px;
            background: #e9ecef;
            border-radius: 4px;
            border-left: 3px solid #007bff;
          }
          .no-messages {
            color: #6c757d;
            font-style: italic;
            text-align: center;
            padding: 20px;
          }
        `}</style>
      </head>
      <body>
        <h1>Interactive Message Form</h1>

        <div class="container">
          <form id="messageForm">
            <div class="form-group">
              <label for="messageText">Your Message:</label>
              <input
                type="text"
                id="messageText"
                name="messageText"
                placeholder="Type your message here..."
                required
              />
            </div>
            <button type="submit">Submit Message</button>
          </form>
        </div>

        <div class="container">
          <h2>Messages</h2>
          <div class="messages" id="messagesContainer">
            {messages.length === 0 ? (
              <div class="no-messages">
                No messages yet. Submit your first message above!
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`message-${index}-${message.slice(0, 10)}`}
                  class="message"
                >
                  {message}
                </div>
              ))
            )}
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
          // Wait for DOM to be fully loaded
          document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('messageForm');
            const messageInput = document.getElementById('messageText');
            const messagesContainer = document.getElementById('messagesContainer');
            
            if (!form || !messageInput || !messagesContainer) {
              console.error('Required elements not found');
              return;
            }
            
            form.addEventListener('submit', async function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              const message = messageInput.value.trim();
              
              if (!message) {
                alert('Please enter a message');
                return;
              }
              
              try {
                const response = await fetch('/message', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ message }),
                  credentials: 'same-origin'
                });
                
                if (response.ok) {
                  const data = await response.json();
                  
                  // Clear the input
                  messageInput.value = '';
                  
                  // Update the messages display
                  const noMessagesDiv = messagesContainer.querySelector('.no-messages');
                  if (noMessagesDiv) {
                    noMessagesDiv.remove();
                  }
                  
                  // Add the new message
                  const messageDiv = document.createElement('div');
                  messageDiv.className = 'message';
                  messageDiv.textContent = message;
                  messagesContainer.appendChild(messageDiv);
                  
                  // Focus back on input
                  messageInput.focus();
                } else {
                  const errorData = await response.json();
                  alert('Failed to submit message: ' + (errorData.error || 'Unknown error'));
                }
              } catch (error) {
                console.error('Error submitting message:', error);
                alert('An error occurred. Please try again.');
              }
            });
            
            // Focus on input when page loads
            messageInput.focus();
          });
        `,
          }}
        ></script>
      </body>
    </html>
  );
}

// Root endpoint - show the form
app.get("/", (c) => {
  const sessionId = getSession(c);
  const messages = sessionMessages.get(sessionId) || [];

  // Set session cookie
  c.header(
    "Set-Cookie",
    `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Strict`,
  );

  return c.html(<MainPage messages={messages} sessionId={sessionId} />);
});

// POST endpoint for submitting messages
app.post("/message", async (c) => {
  const sessionId = getSession(c);
  const { message } = await c.req.json();

  if (
    message === null ||
    message === undefined ||
    typeof message !== "string"
  ) {
    return c.json({ error: "Invalid message" }, 400);
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage === "") {
    return c.json({ error: "Message cannot be empty" }, 400);
  }

  // Add message to session storage
  const messages = sessionMessages.get(sessionId) || [];
  messages.push(trimmedMessage);
  sessionMessages.set(sessionId, messages);

  return c.json({
    success: true,
    message: trimmedMessage,
    messages: messages,
  });
});

export default app;
