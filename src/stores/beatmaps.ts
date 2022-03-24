import create from "zustand";
import localforage from "localforage";

interface Beatmap {
  set_id: string;
}

export interface BeatmapMetadata extends Beatmap {
  publisher: string;
  levels: {
    id: string;
    
    beatmap_name: {
      original: string;
      romanized: string;
    };

    beatmap_artist: {
      original: string;
      romanized: string;
    };

    difficulty_name: string;
    beatmap_path: string;
  }[];
}

export interface BeatmapFiles extends Beatmap {
  files: {
    [path: string]: ArrayBuffer;
  };
}

type BeatmapsStore = {
  /** List all of the beatmaps' metadata. */
  beatmaps: BeatmapMetadata[];
  /** Load a beatmap metadata to memory. */
  loadBeatmap: (set_id: string) => Promise<void>;
  /** Remove beatmap from memory. */
  deleteBeatmap: (set_id: string) => Promise<void>;
};

// In this store, we only store metadatas of beatmaps.
export const beatmapsMetadataStorage = localforage.createInstance({
  name: "osu-storage",
  storeName: "beatmaps-metadata"
});

// In this store, we save every files of each beatmaps
// so we only load them when we need.
export const beatmapsFilesStorage = localforage.createInstance({
  name: "osu-storage",
  storeName: "beatmaps-files"
});

export const useBeatmapsStore = create<BeatmapsStore>((set, get) => ({
  beatmaps: [],
  loadBeatmap: async (set_id) => {
    console.info(`[stores/beatmaps] Loaded beatmap metadata "${set_id}" to memory.`);

    // Get the beatmap from storage.
    const metadata: BeatmapMetadata | null = await beatmapsMetadataStorage.getItem(set_id);

    if (!metadata) return console.error(
      `[stores/beatmaps] Error while loading beatmap "${set_id}": metadata is null.`
    );

    const beatmaps = get().beatmaps;
    beatmaps.push(metadata);
    
    console.info(`[stores/beatmaps] Loaded "${set_id}" !`);
    set(() => ({ beatmaps }));
  },
  deleteBeatmap: async (set_id: string) => {
    console.info(`[stores/beatmaps] Removed beatmap metadata of "${set_id}" from memory.`);

    set(() => ({
      beatmaps: get().beatmaps.filter(beatmap => beatmap.set_id !== set_id)
    }));
  }
}));
