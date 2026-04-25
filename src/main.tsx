import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MedixProvider } from "../lib";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MedixProvider defaultColorMode="light">
      <App />
    </MedixProvider>
  </React.StrictMode>
);
