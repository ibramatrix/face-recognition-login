import React from "react";

export default function FaceResult({ result }) {
  if (!result) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 overflow-auto max-h-96">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-bold text-lg rounded-t-xl px-4 py-2 mb-4">
        Result
      </div>
      <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
