import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeColorsPage from "./ThemeColorsPage";
import { MedixProvider } from "../lib";

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const previewPage = normalizedPath === "/theme-colors" ? <ThemeColorsPage /> : <App />;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MedixProvider defaultColorMode="light">
      {previewPage}
    </MedixProvider>
  </React.StrictMode>
);
