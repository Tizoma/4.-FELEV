import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
//be kell importalni
import { Hello } from "./Hello.jsx";

const container = document.getElementById("root"); // index.htmlben valami divet csinalunk ált. hasonlo nevekkel
const root = createRoot(container);
root.render(
  // strict mode-al nincs mellékhatásos akarmi
  //{}-be adj át propoknak számot
  <React.StrictMode>
    <Hello name="React" count={3}>
      <p>xd haha</p>
    </Hello>
  </React.StrictMode>
);
