import React from "react";

import ReactDOM from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App";

import AuthBootstrap from "./components/AuthBootstrap";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <App />
        </AuthBootstrap>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
