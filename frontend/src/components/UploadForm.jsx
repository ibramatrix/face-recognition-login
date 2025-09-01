import React, { useRef, useState } from "react";
import { registerAPI, loginAPI } from "../api";
import FaceResult from "./FaceResult";

export default function UploadForm({ setResult }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("recognize");
  const [username, setUsername] = useState("");
  const [processing, setProcessing] = useState(false);
  const [localResult, setLocalResult] = useState(null);

  React.useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        console.error("Camera error", err);
      }
    }
    start();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  async function captureFrames(n = 20, delay = 100) {
    const frames = [];
    const ctx = canvasRef.current.getContext("2d");
    for (let i = 0; i < n; i++) {
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.8);
      frames.push(dataUrl);
      await new Promise((r) => setTimeout(r, delay));
    }
    return frames;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (mode === "register" && username.trim() === "") {
      alert("Enter username to register");
      return;
    }

    setProcessing(true);
    setLocalResult(null);
    setResult(null);

    try {
      const prompt =
        mode === "register"
          ? "Register: Blink clearly while capturing frames"
          : "Login: Blink clearly while capturing frames";
      alert(prompt);

      const frames = await captureFrames(20, 120);

      if (mode === "register") {
        const res = await registerAPI(username.trim(), frames);
        setLocalResult(res);
        setResult(res);
      } else {
        const { status, data } = await loginAPI(username.trim(), frames);
        if (status === 200 && data.token) {
          localStorage.setItem("faceauth_token", data.token);
          window.location.href = "/dashboard.html";
        } else {
          setLocalResult(data);
          setResult(data);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Request failed");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
       <div className="flex gap-2 mb-4">
  <button
    type="button"   // <-- prevents accidental form submit
    onClick={() => setMode("recognize")}
    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
      mode === "recognize"
        ? "bg-indigo-600 text-white shadow-lg"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
            Login
          </button>
          <button
  type="button"   // <-- add this
  onClick={() => setMode("register")}
  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
    mode === "register" ? "bg-green-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
>
            Register
          </button>
        </div>

      {(mode === "register" || mode === "recognize") && (
  <div className="mb-4">
    <label className="block text-sm font-semibold mb-1">Username</label>
    <input
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
)}

        <div className="mb-4 relative">
          <video
            ref={videoRef}
            className="w-full rounded-lg border border-gray-300"
            width="640"
            height="480"
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{ display: "none" }}
          />
          {processing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={processing}
          className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-300 ${
            mode === "register" ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {processing ? "Processing..." : mode === "register" ? "Register Face" : "Login with Face"}
        </button>
      </div>

      <div>
        <FaceResult result={localResult} />
      </div>
    </div>
  );
}
