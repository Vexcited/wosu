import JSZip from "jszip";

const beatmapHandler = async (oszFile: ArrayBuffer) => {
  const zip = new JSZip();

  const beatmap = await zip.loadAsync(oszFile);
  console.log(beatmap.files);
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