import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react'
import { monitorOnlineStatus, registerServiceWorker } from './utils/serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
);
// Registering the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker Registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });

  // Listen for messages from the Service Worker
  navigator.serviceWorker.addEventListener("message", (event) => {
    console.log("Message received from Service Worker:", event.data);
    try{

      if (event.data.type === "SYNC_SUBMISSIONS") {
        import("./utils/serviceWorker").then(({ syncSubmissions }) => {
          console.log("Syncing submissions...");
          syncSubmissions(); // Trigger the sync function
        });
      }
    }
    catch(error){
      console.log("error is", error)
    }
  });
} else {
  console.error("Service Workers are not supported in this browser.");
}

reportWebVitals();