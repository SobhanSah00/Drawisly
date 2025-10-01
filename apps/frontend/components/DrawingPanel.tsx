"use client";

interface Drawing {
  id: string;
  data: any;
  createdAt: string;
}

export default function DrawingPanel({ drawings }: { drawings: Drawing[] }) {
  return (
    <div style={{ padding: "1rem", overflowY: "auto", height: "100%" }}>
      <h2>🖌️ Drawings</h2>
      {drawings.length === 0 ? (
        <p>No drawings yet.</p>
      ) : (
        drawings.map((d) => (
          <div
            key={d.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "1rem",
              padding: "0.5rem",
              borderRadius: "8px",
              background: "black",
              color : "white",
            }}
          >
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(d.data, null, 2)}
            </pre>
          </div>
        ))
      )}
    </div>
  );
}
