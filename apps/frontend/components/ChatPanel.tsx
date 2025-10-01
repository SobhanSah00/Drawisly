"use client";

interface Chat {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

export default function ChatPanel({ chats }: { chats: Chat[] }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "1rem",
        overflowY: "auto",
        height: "100%",
      }}
    >
      <h2>💬 Chat</h2>
      {chats.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        chats.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "0.75rem",
              padding: "0.5rem",
              background: "black",
              color : "white",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          >
            <strong>{msg.user.username}</strong>
            <p>{msg.content}</p>
            <small>{new Date(msg.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
