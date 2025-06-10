import { create } from "zustand";

export type PostForm = {
  description: string;
  images: string[];
  habitId: string|null;
  editMode:boolean;
  postId:string|null
};

type PostStore = {
  form: PostForm;
  setDescription: (desc: string) => void;
  addImage: (img: string) => void;
  removeImage: (index: number) => void;
  resetForm: () => void;
  hasUnSavedChanges: () => boolean
  updatePostForm : (form:PostForm) => void
};

export const usePostStore = create<PostStore>((set,get) => ({
  form: {
    description: "",
    images: [],
    habitId: null,
    editMode:false,
    postId:null
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
        postId:null
      },
    })),
   hasUnSavedChanges: () => {
    const { description, images,habitId } = get().form;
    return description.trim().length > 0 || images.length > 0 || habitId !== null;
  },
  updatePostForm:(form:PostForm) => set(() => ({ form }))
}));
