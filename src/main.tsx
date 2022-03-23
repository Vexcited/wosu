import "@fontsource/exo-2/latin-300.css";
import "@fontsource/exo-2/latin-400.css";
import "@fontsource/exo-2/latin-500.css";
import "@/styles/globals.css";

import React from "react";
import ReactDOM from "react-dom";

import {
  useBeatmapsStore,
  beatmapsStorage
} from "@/stores/beatmaps";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import HomePage from "@/pages/index";
import NotFoundPage from "@/pages/404";
import SettingsPage from "./pages/settings";
import SinglePlayerMenuPage from "@/pages/singleplayer/index";
import MultiPlayerMenuPage from "@/pages/multiplayer/index";

/** Defining the router of the application. */
function AppRouter () {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />

        <Route path="singleplayer" element={<SinglePlayerMenuPage />} />
        <Route path="multiplayer" element={<MultiPlayerMenuPage />} />
        <Route path="settings" element={<SettingsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

/** Effects and triggers on first load. */
function App () {
  React.useEffect(() => {
    (async () => {
      console.group("[/] Loading stored beatmaps...");
      const beatmap_ids = await beatmapsStorage.keys();
      console.info(`Got ${beatmap_ids.length} beatmap(s).`);

      if (beatmap_ids.length > 0) {
        for (const beatmap_id of beatmap_ids) {
          const beatmap = await beatmapsStorage.getItem(beatmap_id);
          console.info(`Loaded beatmap "${beatmap_id}" !`);
        }

        console.info("Loaded all the beatmaps !");
      }
      else console.info("No beatmaps found, skipping.");
      console.groupEnd();
    })();
  }, []);

  return (
    <AppRouter />
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);