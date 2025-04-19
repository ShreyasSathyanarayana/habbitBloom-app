import {create} from 'zustand';

type HabitStore = {
    selectedFilter: "latest" | "alphabetical";
    updateSelectedFilter: (filter: "latest" | "alphabetical") => void
}

export const useHabitStore = create<HabitStore>((set) => ({
    selectedFilter: "latest",
    updateSelectedFilter: (filter: "latest" | "alphabetical") => set({ selectedFilter: filter }),
}))