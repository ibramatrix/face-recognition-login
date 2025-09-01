import React, { useRef, useState } from "react";

function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch (err) {
      alert("Camera access denied!");
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const data = canvasRef.current.toDataURL("image/png");
    onCapture(data);
  };

  return (
    <div className="camera-box">
      {!streaming ? (
        <button onClick={startCamera}>Start Camera</button>
      ) : (
        <>
          <video ref={videoRef} autoPlay width="320" height="240" />
          <canvas ref={canvasRef} width="320" height="240" hidden />
          <button onClick={capturePhoto}>Capture</button>
        </>
      )}
    </div>
  );
}

export default CameraCapture;
