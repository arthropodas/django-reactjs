// const CACHE_NAME = "examAppCache-v1";
// const urlsToCache = [];

// import { openDB } from "idb";

// // Install event
// self.addEventListener("install", (event) => {
//   console.log("Service Worker: Installed");
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Caching assets");
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// // Activate event
// self.addEventListener("activate", (event) => {
//   console.log("Service Worker: Activated");
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cache) => {
//           if (cache !== CACHE_NAME) {
//             console.log("Clearing old cache:", cache);
//             return caches.delete(cache);
//           }
//         })
//       )
//     )
//   );
// });

// // Sync event
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'submitAnswers') {
//     console.log("Sync event triggered for submitAnswers");
//     event.waitUntil(
//       self.clients.matchAll().then((clients) => {
//         if (clients && clients.length) {
//           // Post a message back to the client to trigger the sync
//           clients[0].postMessage({
//             type: 'SYNC_SUBMISSIONS',
//           });
//         }
//       })
//     );
//   }
// });

// export function register() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//       .register('/service-worker.js')
//       .then((registration) => {
//         console.log('Service Worker registered with scope:', registration.scope);

//         // Register background sync event
//         if ('SyncManager' in window) {
//           navigator.serviceWorker.ready.then((registration) => {
//             registration.sync
//               .register('sync-data')
//               .then(() => {
//                 console.log('Sync data registered');
//               })
//               .catch((err) => {
//                 console.error('Sync registration failed:', err);
//               });
//           });
//         }
//       })
//       .catch((error) => {
//         console.error('Service Worker registration failed:', error);
//       });
//   }
// }

// export function register() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//       .register('/serviceWorker.js')
//       .then((registration) => {
//         console.log('Service Worker registered with scope:', registration.scope);

//         // Register background sync event
//         if ('SyncManager' in window) {
//           navigator.serviceWorker.ready.then((registration) => {
//             registration.sync
//               .register('sync-data')
//               .then(() => {
//                 console.log('Sync data registered');
//               })
//               .catch((err) => {
//                 console.error('Sync registration failed:', err);
//               });
//           });
//         }
//       })
//       .catch((error) => {
//         console.error('Service Worker registration failed:', error);
//       });
//   }
// }

importScripts('../src/services/StudentServices');
const CACHE_NAME = 'my-app-cache-v2'; // Versioned cache name
const STATIC_ASSETS = [
 
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  
  // Cache all static assets
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  
  // Delete old caches that are not the current cache version
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching', event.request.url);

  // Serve requests from cache first, then network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('Serving from cache:', event.request.url);
        return cachedResponse;  // Return cached response if available
      }
      
      // Fetch from network if not cached
      return fetch(event.request).then((networkResponse) => {
        // Cache the new response for future use
        if (event.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;  // Return network response
      });
    })
  );
});


self.addEventListener("sync", (event) => {
  console.log("Sync event triggered:", event.tag);
  if (event.tag === "submitAnswers") {
    event.waitUntil(syncSubmissions());
  }
});

// Fetch data from IndexedDB and call the API
async function syncSubmissions() {
  console.log("Processing submissions in service worker...");

  const db = await openIndexedDB();
  const allData = await getAllData(db);

  for (const userData of allData) {
    const { token, answers } = userData;

    if (!token || !answers) {
      console.error("Incomplete data for submission:", userData);
      continue;
    }

    const transformedAnswers = {
      action: "submit",
      response: Object.entries(answers).map(([questionId, studentInput]) => ({
        questionId: parseInt(questionId, 10),
        studentInput,
      })),
    };

    try {
      console.log("before calling the API");

      // Using the native fetch to submit the answers
      const response = await studentServices.answerSubmission(token, transformedAnswers);

      // Check if the response is successful
      if (response.ok) {
        console.log("Submission synced successfully for token:", token);

        // Assuming the data has been successfully synced, delete it from IndexedDB
        await deleteData(db, token); // Remove synced data
      } else {
        console.error("Failed to sync submission for token:", token, response);
      }
    } catch (error) {
      console.error("Error syncing submission for token:", token, error);
    }
  }
}

// Open IndexedDB
async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("exam-db", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("exam-data")) {
        db.createObjectStore("exam-data", { keyPath: "token" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject("Failed to open IndexedDB: " + event.target.error);
    };
  });
}

// Get all data from the IndexedDB object store
async function getAllData(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("exam-data", "readonly");
    const store = transaction.objectStore("exam-data");
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject("Failed to fetch data from IndexedDB: " + event.target.error);
    };
  });
}

// Delete the data after it has been successfully synced
async function deleteData(db, token) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("exam-data", "readwrite");
    const store = transaction.objectStore("exam-data");
    const request = store.delete(token);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject("Failed to delete data from IndexedDB: " + event.target.error);
    };
  });
}

// API call using fetch for submission
// const answerSubmission = async (token, transformedAnswers) => {
//   try {
//     const response = await fetch(
//       `http://127.0.0.1:8000/recruit-system/student/valuation?token=${encodeURIComponent(token)}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(transformedAnswers),
//       }
//     );
//     return response; // Return the response from fetch
//   } catch (error) {
//     console.error("Error during API call:", error);
//     throw error;
//   }
// };