import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./styles/globals.css";
import { ScrollToTop } from "./components/ScrollToTop";

const root = document.getElementById("root")!;

createRoot(root).render(
  <BrowserRouter>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </BrowserRouter>
);
