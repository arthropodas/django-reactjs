import { create } from 'zustand';

const useExamStore = create((set) => ({
  questionnaireData: {},
  setQuestionnaireData: (data)=> set({ questionnaireData: data }),
  clearQuestionnaireData: ()=>set({questionnaireData: {}}),

}));

export default useExamStore;
