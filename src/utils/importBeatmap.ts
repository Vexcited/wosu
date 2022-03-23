import type { Beatmap } from "@/stores/beatmaps";

import JSZip from "jszip";

const beatmapHandler = async (oszFile: ArrayBuffer) => {
  const zip = new JSZip();

  // Get metadata of the beatmap.
  const beatmap_data = await zip.loadAsync(oszFile);
  const beatmap_object: Beatmap = {
    set_id: "",
    publisher: "",
    levels: [],
    files: {}
  };

  for (const [path, data] of Object.entries(beatmap_data.files)) {
    const file = await data.async("arraybuffer");
    beatmap_object.files[path] = file;

    if (path.endsWith(".osu")) {
      console.log("Parsing `.osu` file.");

      const osu_data = await data.async("text");
      const osu_level_object: Beatmap["levels"][0] = {
        id: "",
        name: "",
        path
      };

      const lines = osu_data.split("\n");
      for (const line of lines) {
        const [key, value] = line.split(":").map(a => a.trim());

        switch (key) {
        case "BeatmapSetID":
          beatmap_object.set_id = value;
          break;
        case "BeatmapID":
          osu_level_object.id = value;
          break;
        case "Version":
          osu_level_object.name = value;
          break;
        case "Creator":
          beatmap_object.publisher = value;
          break;
        }
      }

      // Add the level to the beatmap.
      beatmap_object.levels.push(osu_level_object);
      console.info("Finished parsing `.osu` file.");
    }
  }

  console.log(beatmap_object);
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