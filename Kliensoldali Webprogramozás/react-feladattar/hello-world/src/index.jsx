import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Hello } from "./Hello";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Hello name="General Kenobi" count="3">
        <p>A small message for you!</p>
    </Hello>
  </React.StrictMode>
);
