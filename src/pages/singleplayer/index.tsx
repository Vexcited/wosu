import { Link } from "react-router-dom";
import { useState } from "react";

import { useBeatmapsStore } from "@/stores/beatmaps";
import { importBeatmap } from "@/utils/importBeatmap";

export default function SinglePlayerMenuPage () {
  const beatmaps = useBeatmapsStore(state => state.beatmaps);
  const [importing, setImporting] = useState(false);

  const importBeatmapHandler = () => {
    setImporting(true);
    importBeatmap(() => {
      setImporting(false);
    });
  };

  return (
    <div className="relative w-screen h-screen">
      <header className="flex justify-between px-2 items-center w-full h-16 md:h-20 bg-zinc-900">
        <div className="flex flex-col">
          <h3 className="text-md md:text-xl">Welcome to the selection menu</h3>
          <span className="text-sm md:text-base text-zinc-400">
            Select a beatmap to have informations here !
          </span>
        </div>
      </header>

      {beatmaps.length <= 0 &&
        <div className="fixed top-0 h-screen w-screen flex flex-col justify-center items-center">
          <h3>No beatmap found !</h3>
          {importing && <span>Importing...</span>}
          <button onClick={importBeatmapHandler}>Import an osu! beatmap (.osz)</button>
        </div>
      }

      <footer className="flex justify-between px-6 items-center absolute bottom-0 w-full h-16 bg-zinc-900">
        <div>
          <Link to="/">Back</Link>
        </div>
        <div>
          <p>Loaded {beatmaps.length} beatmap(s)</p>
        </div>
      </footer>
    </div>
  );
}