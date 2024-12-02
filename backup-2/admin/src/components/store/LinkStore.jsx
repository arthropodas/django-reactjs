import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define your store with `persist` middleware
const useLinkStore = create(
  persist(
    (set) => ({
      link: '',
      setLink: (newLink) => set({ link: newLink }),
      clearLink: () => set({ link: '' }),

      examData: {},
      setExamData: (data) => set({ examData: data }),
      clearExamData: () => set({ examData: {} }),
    }),
    {
      name: 'exam-storage', // unique name for localStorage
      getStorage: () => localStorage, // Use localStorage to persist
    }
  )
);

export default useLinkStore;
