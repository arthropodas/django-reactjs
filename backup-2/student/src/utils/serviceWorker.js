import { openDB } from "idb";
import { studentServices } from "../services/StudentServices";
import { getAllExamData } from "./indexedDB";

export async function syncSubmissions() {
  try {
    console.log("Syncing submissions...");
    const allData = await getAllExamData(); // Retrieve the cached data
    const token = localStorage.getItem("token");

    const userData = allData.find((data) => data.token === token);

    if (!userData) {
      console.error("No data found to sync");
      return;
    }

    const answers = userData.answers;
    const transformedAnswers = {
      action: "submit",
      response: Object.entries(answers).map(([questionId, studentInput]) => ({
        questionId: parseInt(questionId, 10),
        studentInput,
      })),
    };

    // Make the API call to submit answers
    const response = await studentServices.answerSubmission(
      userData.token,
      transformedAnswers
    );
    console.log("response", response)
    if (response.ok) {
      console.log("Submission synced:", response);
    } else {
      console.error("Error syncing submission:", response);
    }
  } catch (error) {
    console.error("Error.....:", error);
  }
}

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) =>
        console.log("Service Worker registered:", registration)
      )
      .catch((error) =>
        console.error("Service Worker registration failed:", error)
      );
  }
}

export function monitorOnlineStatus() {
  window.addEventListener("online", () => {
    syncSubmissions();
  });
  window.addEventListener("offline", () =>
    console.log("Offline: Saving data locally")
  );
}
