import "@fontsource/exo-2/latin-300.css";
import "@fontsource/exo-2/latin-400.css";
import "@fontsource/exo-2/latin-500.css";

import "@/styles/globals.css";

import React from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import HomePage from "@/pages/index";
import NotFoundPage from "@/pages/404";
import SinglePlayerMenuPage from "@/pages/singleplayer/index";
import MultiPlayerMenuPage from "@/pages/multiplayer/index";

function AppRouter () {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />

        <Route path="singleplayer" element={<SinglePlayerMenuPage />} />
        <Route path="multiplayer" element={<MultiPlayerMenuPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById("root")
);