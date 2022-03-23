import create from "zustand";
import localforage from "localforage";

export interface Beatmap {
  set_id: string;
  publisher: string;
  levels: {
    id: string;
    name: string;
    path: string;
  }[];
  files: {
    [path: string]: ArrayBuffer;
  };
}

export type BeatmapsStore = {
  beatmaps: Beatmap[];
  setBeatmap: (beatmaps: Beatmap) => Promise<void>;
  deleteBeatmap: (set_id: string) => Promise<void>;
};

export const beatmapsStorage = localforage.createInstance({
  storeName: "osu-storage",
  name: "beatmaps"
});

export const useBeatmapsStore = create<BeatmapsStore>((set, get) => ({
  beatmaps: [],
  setBeatmap: async (beatmap: Beatmap) => {
    console.group(`[stores/beatmaps] Configuring beatmap "${beatmap.set_id}".`);

    // Updating persist store.
    await beatmapsStorage.setItem(beatmap.set_id, beatmap);
    console.info("[localForage] Beatmap configured.");

    const beatmaps = get().beatmaps;
    beatmaps.push(beatmap);
    
    // Updating local store.
    set(() => ({ beatmaps }));
    console.info("[zustand] Beatmap configured.");
    console.groupEnd();
  },
  deleteBeatmap: async (set_id: string) => {
    set(() => ({
      beatmaps: get().beatmaps.filter(beatmap => beatmap.set_id !== set_id)
    }));
  }
}));