import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/index.css";
import "@/styles/markdown/table.css";
import "@/styles/globals.css";
import "@/styles/markdown/markdown.css";
import "@/styles/canvas.css";
import Layout from "@/Layout";
import App from "@/App";
import Notebook from "@/pages/notebook/App";
import Notebooks from "@/pages/notebooks/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<App />}></Route>
          <Route path="/notebooks" element={<Notebooks />}></Route>
          <Route
            path="/notebook/:notebook_slug"
            element={<Notebook />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
