import { Link } from "react-router-dom";
import { useState } from "react";

import { useBeatmapsStore } from "@/stores/beatmaps";
import { importBeatmap } from "@/utils/importBeatmap";

export default function SinglePlayerMenuPage () {
  const beatmaps = useBeatmapsStore(state => state.beatmaps);
  const [importing, setImporting] = useState(false);
  const [selectedBeatmapSetId, setSelectedBeatmapSetId] = useState("");
  const [selectedBeatmapId, setSelectedBeatmapId] = useState("");

  const importBeatmapHandler = () => {
    setImporting(true);
    importBeatmap(() => {
      setImporting(false);
    });
  };

  return (
    <div className="relative w-screen h-screen">
      <header className="fixed top-0 flex justify-between px-2 items-center w-full h-16 md:h-20 bg-zinc-900">
        <div className="flex flex-col">
          <h3 className="text-md md:text-xl">
            {selectedBeatmapId && selectedBeatmapSetId
              ? beatmaps.find(a => a.set_id === selectedBeatmapSetId)?.levels.find(a => a.id === selectedBeatmapId)?.beatmap_name.romanized 
              : "Welcome to the selection menu"
            }
          </h3>
          <span className="text-sm md:text-base text-zinc-400">
            {selectedBeatmapId && selectedBeatmapSetId
              ? "Difficulty: " + beatmaps.find(a => a.set_id === selectedBeatmapSetId)?.levels.find(a => a.id === selectedBeatmapId)?.difficulty_name 
              : "Select a beatmap to have informations here !"
            }
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

      {beatmaps.length > 0 &&
        <div className="py-[35vh] flex flex-col flex-end bg-opacity-40 w-screen items-end">
          {beatmaps.map(beatmap => <>
            {beatmap.levels.map(level =>
              <div
                onClick={() => {
                  setSelectedBeatmapSetId(beatmap.set_id);
                  setSelectedBeatmapId(level.id);
                }}
                className={`px-6 py-2 bg-opacity-80 w-3/5 ${beatmap.set_id === selectedBeatmapSetId ? "bg-purple-600" : "bg-zinc-900"} hover:bg-purple-400`}
                key={level.id}
              >
                <h2>{level.beatmap_name.romanized}</h2>
                <span>{level.beatmap_artist.romanized} - Difficulty: {level.difficulty_name}</span>
              </div>
            )}
          </>
          )}
        </div>
      }

      <footer className="flex justify-between px-6 items-center fixed bottom-0 w-full h-16 bg-zinc-900">
        <div className="flex gap-4 justify-center items-center">
          <Link to="/">Back</Link>
          <button onClick={importBeatmapHandler}>Import .osz</button>
        </div>
        <div>
          <p>Loaded {beatmaps.length} beatmap(s)</p>
        </div>
      </footer>
    </div>
  );
}
