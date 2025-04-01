"use client";

import { useState } from "react";
import { loginUser } from "../services/authService"; 
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); 
    setLoading(true); 

    try {
      const response = await loginUser({ userName, password });

      if (response.status === 200) {
        const { user } = response.data;

        // Redirect based on user role
        if (user.role.some((r: any) => r.roleName === "ADMIN")) {
          router.push("/admin-dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setMessage(response.message);
      }
    } catch (err) {
      setMessage("Login failed. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium">Username:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {message && <p className="mt-2 text-center text-red-500">{message}</p>}
    </form>
  );
}
