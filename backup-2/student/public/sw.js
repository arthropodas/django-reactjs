const CACHE_NAME = "examAppCache-v1";
const urlsToCache = [];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Sync event
self.addEventListener('sync', (event) => {
  console.log("consodle.... syc")
  if (event.tag === 'submitAnswers') {
    console.log("Sync event triggered for submitAnswers");
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        if (clients && clients.length) {
          // Post a message back to the client to trigger the sync
          clients[0].postMessage({
            type: 'SYNC_SUBMISSIONS',
          });
        }
      })
    );
  }
});

// sw.js
// self.addEventListener("sync", (event) => {
//   console.log("Service Worker: Sync event triggered", event);
//   if (event.tag === "submitAnswers") {
//     event.waitUntil(
//       syncSubmissions().then(() => {
//         self.clients.matchAll().then((clients) => {
//           clients.forEach((client) => {
//             client.postMessage({
//               type: "SYNC_SUBMISSIONS_COMPLETE",
//             });
//           });
//         });
//       })
//     );
//   }
// });

// self.addEventListener("message", (event) => {
//   if (event.data.type === "SYNC_SUBMISSIONS") {
//     console.log("Syncing submissions from Service Worker message...");
//     syncSubmissions().then(() => {
//       self.clients.matchAll().then((clients) => {
//         clients.forEach((client) => {
//           client.postMessage({
//             type: "SYNC_SUBMISSIONS_COMPLETE",
//           });
//         });
//       });
//     }).catch((error) => {
//       console.error("Error syncing submissions:", error);
//     });
//   }
// });
