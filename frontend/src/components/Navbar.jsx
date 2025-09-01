import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-white text-2xl font-extrabold tracking-tight">
          FaceAuth123
        </h1>
        <div className="text-white font-medium text-sm md:text-base">
          Secure Face Login with Liveness Detection
        </div>
      </div>
    </nav>
  );
}
