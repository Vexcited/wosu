import type {
  BeatmapMetadata,
  BeatmapFiles
} from "@/stores/beatmaps";

import JSZip from "jszip";
import {
  useBeatmapsStore,
  beatmapsFilesStorage,
  beatmapsMetadataStorage
} from "@/stores/beatmaps";
import { arrayBufferToString } from "@/utils/encoding";

const beatmapHandler = async (oszFile: ArrayBuffer) => {
  const zip = new JSZip();

  // Load function to add beatmap metadata to memory.
  const loadBeatmapToMemory = useBeatmapsStore.getState().loadBeatmap;

  /** Extracted `.osz` file. */
  const osz = await zip.loadAsync(oszFile);

  const beatmap_metadata: BeatmapMetadata = {
    set_id: "",
    publisher: "",
    levels: []
  };

  const beatmap_files: BeatmapFiles = {
    set_id: "",
    files: {}
  };

  for (const [path, data] of Object.entries(osz.files)) {
    /**
     * Add the file to `beatmap_files` to be 
     * saved later in local files storage.
     */
    const file = await data.async("arraybuffer");
    beatmap_files.files[path] = file;
    console.info(`[beatmap_files] + "${path}"`);

    if (path.endsWith(".osu")) {
      // Read every `.osu` file as text
      // to extract metadataa from them.
      const osu_data = arrayBufferToString(file);
      const beatmap_level: BeatmapMetadata["levels"][0] = {
        id: "",
        name: "",
        path
      };

      const lines = osu_data.split("\n");
      for (const line of lines) {
        const [key, value] = line.split(":").map(a => a.trim());

        switch (key) {
        case "BeatmapSetID":
          beatmap_metadata.set_id = value;
          beatmap_files.set_id = value;
          break;
        case "BeatmapID":
          beatmap_level.id = value;
          break;
        case "Version":
          beatmap_level.name = value;
          break;
        case "Creator":
          beatmap_metadata.publisher = value;
          break;
        }
      }

      // Add the level to the beatmap.
      beatmap_metadata.levels.push(beatmap_level);
      console.info(
        `[beatmap_metadata] + Added a difficulty "${beatmap_level.name}".`
      );
    }
  }

  console.info("Finished to extract `.osz` file. Saving the files to local storage...");

  await beatmapsFilesStorage.setItem(beatmap_files.set_id, beatmap_files);

  console.info("Files saved ! Now saving the metadata...");

  await beatmapsMetadataStorage.setItem(beatmap_metadata.set_id, beatmap_metadata);

  console.info("Metadata saved ! Saving them to memory...");

  await loadBeatmapToMemory(beatmap_metadata.set_id);
  console.info("Finished importing.");
};

const importBeatmapHandler = async (evt: Event) => {
  evt.preventDefault();

  // Infering type.
  if (!(evt.target instanceof HTMLInputElement))
    return evt.target?.dispatchEvent(
      new CustomEvent("import-beatmap-error")
    );

  // Send an import start event.
  evt.target.dispatchEvent(
    new CustomEvent("import-beatmap-start")
  );

  // Check if a file was imported.
  const files = evt.target.files;
  if (!files || files.length <= 0)
    return evt.target.dispatchEvent(
      new CustomEvent("import-beatmap-abort")
    );
  
  // Read that `.osz` as ArrayBuffer, to open as ZIP.
  const file = files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async () => {
      const fileData = reader.result as ArrayBuffer;
      await beatmapHandler(fileData);

      /** Send an event saying we've finished importing. */
      evt.target?.dispatchEvent(
        new CustomEvent("import-beatmap-finish")
      );
    };

    reader.readAsArrayBuffer(file);
  }
};

export const importBeatmap = (callback: (success: boolean, message?: string) => void) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", ".osz"); 
  input.setAttribute("hidden", "true");
  
  // Listen for the change event.
  input.addEventListener("change", (evt) => {
    importBeatmapHandler(evt);
  });

  // Add to DOM and trigger click.
  document.body.appendChild(input);
  input.click();

  input.addEventListener("import-beatmap-start", () => {
    console.group("[importBeatmap] Importing beatmap...");
  });

  /** Short-hand to remove the input from DOM and callback. */
  const finish: typeof callback = (success, message) => {
    console.groupEnd();

    document.body.removeChild(input);
    callback(success, message);
  };

  input.addEventListener("import-beatmap-finish", () => {
    console.info("Import finished !");
    finish(true);
  });

  input.addEventListener("import-beatmap-error", () => {
    console.error("Error happenned when importing the beatmap.");
    finish(false, "Error when importing, check the console.");
  });

  input.addEventListener("import-beatmap-abort", () => {
    console.info("Aborted the import.");
    finish(false, "Aborted.");
  });
};
