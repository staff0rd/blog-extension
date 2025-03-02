import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Options } from "./Options";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
