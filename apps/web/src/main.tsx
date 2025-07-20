import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "@/Layout";
import App from "@/App";
import Notebook from "@/pages/notebook/App";
import Notebooks from "@/pages/notebooks/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<App />}></Route>
          <Route path="/notebooks" element={<Notebooks />}></Route>
          <Route
            path="/notebook/:notebook_name"
            element={<Notebook />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
