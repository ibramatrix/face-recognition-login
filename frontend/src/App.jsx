import React from "react";
import Navbar from "./components/Navbar";
import UploadForm from "./components/UploadForm";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">Face Authentication</h2>
        <p className="mb-6 text-slate-300">Register with your face and login securely. Please allow webcam and blink when prompted.</p>
        <UploadForm setResult={() => {}} />
      </main>
    </div>
  );
}
