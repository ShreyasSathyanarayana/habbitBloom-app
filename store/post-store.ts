import { create } from "zustand";

export type PostForm = {
  description: string;
  images: string[];
  habitId: string|null;
  editMode:boolean;
  postId:string|null;
  habitName:string;
  rewardPostMode:boolean
};

type PostStore = {
  form: PostForm;
  setDescription: (desc: string) => void;
  addImage: (img: string) => void;
  removeImage: (index: number) => void;
  resetForm: () => void;
  hasUnSavedChanges: () => boolean
  updatePostForm : (form:PostForm) => void
  updateHabitDetails : (habitId:string,habitName:string) => void
  resetHabitDetails:()=>void
};

export const usePostStore = create<PostStore>((set,get) => ({
  form: {
    description: "",
    images: [],
    habitId: null,
    editMode:false,
    postId:null,
    habitName:'',
    rewardPostMode:false
  },
  setDescription: (desc) =>
    set((state) => ({ form: { ...state.form, description: desc } })),
  addImage: (img) =>
    set((state) => ({ form: { ...state.form, images: [...state.form.images, img] } })),
  removeImage: (index) =>
    set((state) => ({
      form: {
        ...state.form,
        images: state.form.images.filter((_, i) => i !== index),
      },
    })),
  resetForm: () =>
    set(() => ({
      form: {
        description: "",
        images: [],
        habitId: null,
        editMode:false,
        postId:null,
        habitName:'',
        rewardPostMode:false
      },
    })),
   hasUnSavedChanges: () => {
    const { description, images,habitId } = get().form;
    return description.trim().length > 0 || images.length > 0 || habitId !== null;
  },
  updatePostForm:(form:PostForm) => set(() => ({ form })),
  updateHabitDetails:(habitId,habitName)=>set(() => ({ form: { ...get().form, habitId,habitName } })),
  resetHabitDetails:()=>set(() => ({ form: { ...get().form, habitId: null,habitName:'' } })),
}));
