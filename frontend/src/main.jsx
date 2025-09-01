import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Tailwind CSS
import "./index.css";

// Third-party CSS from node_modules
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(<App />);
