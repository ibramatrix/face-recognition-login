import React, { useEffect, useState } from "react";
import { meAPI } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  async function load() {
    const token = localStorage.getItem("faceauth_token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    try {
      const res = await meAPI(token);
      if (res.username) {
        setUser(res.username);
      } else {
        localStorage.removeItem("faceauth_token");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Failed to load user:", err);
      localStorage.removeItem("faceauth_token");
      window.location.href = "/";
    }
  }

  useEffect(() => { load(); }, []);

  function logout() {
    localStorage.removeItem("faceauth_token");
    window.location.href = "/";
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">
        {user ? `Welcome ${user} 👋` : "Loading..."}
      </h2>
      <p className="mb-6">You logged in using face authentication.</p>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
