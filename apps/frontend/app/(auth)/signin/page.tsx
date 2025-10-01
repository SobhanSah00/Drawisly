"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState("");

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5050/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 VERY IMPORTANT for cookies
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Signin successful ✅");
        setUsername("")
        setPassword("")
        router.push("/dashboard")
        console.log("User:", data.user);
      } else {
        setMessage(data.error || data.message || "Signin failed ❌");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Network error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={{cursor : "pointer"}} type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
