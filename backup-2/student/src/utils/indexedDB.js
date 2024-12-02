export const openDB = () => {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open("examDB", 1);

      request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("examResponses")) {
              db.createObjectStore("examResponses", { keyPath: "id", autoIncrement: true });
          }
      };

      request.onerror = (event) => {
          reject(event.target.error);
      };

      request.onsuccess = (event) => {
          resolve(event.target.result);
      };
  });
};

export const saveExamData = async (examData) => {
  try {
      const db = await openDB();
      const transaction = db.transaction("examResponses", "readwrite");
      const store = transaction.objectStore("examResponses");

      // Store the exam data with a unique id
      store.add(examData);

      transaction.oncomplete = () => {
          console.log("Exam data stored successfully");
      };

      transaction.onerror = (event) => {
          console.error("Error storing exam data", event.target.error);
      };
  } catch (error) {
      console.error("Error accessing IndexedDB", error);
  }
};

export const getAllExamData = async () => {
  try {
      const db = await openDB();
      const transaction = db.transaction("examResponses", "readonly");
      const store = transaction.objectStore("examResponses");

      return new Promise((resolve, reject) => {
          const request = store.getAll();

          request.onsuccess = (event) => {
              resolve(event.target.result); 
          };

          request.onerror = (event) => {
              reject(event.target.error);
          };
      });
  } catch (error) {
      console.error("Error fetching data from IndexedDB", error);
      throw error;
  }
};


export const getExamDataByEmail = async (email) => {
  try {
    const db = await openDB(); // open the IndexedDB
    const transaction = db.transaction("examResponses", "readonly");
    const store = transaction.objectStore("examResponses");

    // If 'email' is the key or indexed, use store.get() to fetch by email.
    const request = store.get(email);  // Assuming email is the key.

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result);  // Returns the single exam response by email
      };

      request.onerror = (event) => {
        reject(event.target.error);  // Handles any errors that occur
      };
    });
  } catch (error) {
    console.error("Error fetching data by email from IndexedDB", error);
    throw error;
  }
};