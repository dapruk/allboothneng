import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppProviders from "./providers/app-providers.tsx";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <AppProviders />
    </StrictMode>,
  );
}
