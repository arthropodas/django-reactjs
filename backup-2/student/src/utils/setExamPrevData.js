import useExamResponseStore from '../components/store/ResponseStore'; // Adjust path to where the store is located


export default function setExamPrevData(examData) {
  // Destructure the relevant data from examData
  const { time, answers, status, examTitle, token } = examData;
  console.log("time", time)

  // Get the actions from the store
  const { setTime, setAnswer } = useExamResponseStore.getState();

  // Dispatch the action to set the time
  setTime(time.hours, time.minutes, time.seconds);

  // Dispatch the action to set the answers
  Object.keys(answers).forEach((questionId) => {
    setAnswer(questionId, answers[questionId]);
  });

  // Optionally, you can store other data like examTitle, status, and token if needed.
  // Example: setStatus(status); or setExamTitle(examTitle);
}
