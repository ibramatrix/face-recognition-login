import React, { useState } from "react";
import CameraCapture from "./CameraCapture";
import api from "../api";

function Register({ navigate }) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleRegister = async () => {
    if (!name || !photo) return alert("Fill all fields!");
    try {
      await api.post("/register", { name, image: photo });
      alert("Registration successful!");
      navigate("/login");
    } catch {
      alert("Registration failed!");
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <CameraCapture onCapture={setPhoto} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
