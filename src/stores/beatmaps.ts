import create from "zustand";
import localforage from "localforage";

export interface Beatmap {
  id: string;
  name: string;
  creator: string;
  levels: {
    /** Stars of the level. */
    difficulty: number;
    /** The name of the level. */
    name: string;
  }[];
  files: Uint8Array[];
}

export type BeatmapsStore = {
  beatmaps: Beatmap[];
  setBeatmap: (beatmaps: Beatmap) => Promise<void>;
  deleteBeatmap: (id: string) => Promise<void>;
};

export const beatmapsStorage = localforage.createInstance({
  storeName: "osu-storage",
  name: "beatmaps"
});

export const useBeatmapsStore = create<BeatmapsStore>((set, get) => ({
  beatmaps: [],
  setBeatmap: async (beatmap: Beatmap) => {
    console.group(`[stores/beatmaps] Configuring beatmap "${beatmap.id}".`);

    // Updating persist store.
    await beatmapsStorage.setItem(beatmap.id, beatmap);
    console.info("[localForage] Beatmap configured.");

    const beatmaps = get().beatmaps;
    beatmaps.push(beatmap);
    
    // Updating local store.
    set(() => ({ beatmaps }));
    console.info("[zustand] Beatmap configured.");
    console.groupEnd();
  },
  deleteBeatmap: async (id: string) => {
    set(() => ({
      beatmaps: get().beatmaps.filter(beatmap => beatmap.id !== id)
    }));
  }
}));