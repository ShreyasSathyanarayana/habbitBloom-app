import { create } from "zustand";

type ProfileStore={
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    isLoading: false,
    setLoading: (loading: boolean) => set({ isLoading: loading }),
}));