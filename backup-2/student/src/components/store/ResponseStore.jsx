import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { studentServices } from '../../services/StudentServices';

const useExamResponseStore = create(persist((set, get) => ({
  answers: {},
  time: { hours: 0, minutes: 0, seconds: 0 }, // Provide default time
  clearAnswers: () => set({ answers: {} }),
  setAnswer: (questionId, selectedOptions) => {
    set((state) => {
      const updatedAnswers = { ...state.answers };

      if (selectedOptions.length === 0) {
        delete updatedAnswers[questionId];
      } else {
        updatedAnswers[questionId] = selectedOptions;
      }

      return { answers: updatedAnswers };
    });
  },
  setTime: (hours, minutes, seconds) => {
    set({ time: { hours, minutes, seconds } });
  },
  submitAnswers: async (tokenFromUrl) => {
    const formattedAnswers = {
      action: 'submit',
      response: Object.keys(get().answers).map((questionId) => ({
        questionId: parseInt(questionId, 10),
        studentInput: Array.isArray(get().answers[questionId])
          ? get().answers[questionId]
          : [get().answers[questionId]],
      })),
    };

    try {
      const response = await studentServices.answerSubmission(tokenFromUrl, formattedAnswers);
      set({ answers: {} });
      return response;
    } catch (error) {
      set({ answers: {} });
      console.error("Error submitting answers:", error);
    }
  },
}), {
  name: "response-storage", // Name of the storage key
  getStorage: () => localStorage, // Use localStorage to persist
}));

export default useExamResponseStore;
