import { createRoot } from "react-dom/client";
import App from "./App";
import "./global.css";
import "reflect-metadata";

createRoot(document.getElementById("root")!).render(<App />);
