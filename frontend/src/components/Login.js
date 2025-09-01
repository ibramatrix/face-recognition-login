import React, { useState } from "react";
import CameraCapture from "./CameraCapture";
import api from "../api";

function Login({ navigate }) {
  const [photo, setPhoto] = useState(null);

  const handleLogin = async () => {
    if (!photo) return alert("Take a picture!");
    try {
      const res = await api.post("/login", { image: photo });
      localStorage.setItem("user", res.data.user);
      navigate("/dashboard");
    } catch {
      alert("Login failed!");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <CameraCapture onCapture={setPhoto} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
