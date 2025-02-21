"use client"

import { useEffect, useState } from "react";
// import { Settings } from "lucide-react";
import WaterProgress from "@/components/water-progress.js";
import RecordsList from "@/components/records-list.js";

export default function Page() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    console.log("Initialization useEffect running");
    const initializeNotifications = async () => {
      if ("Notification" in window && Notification.permission !== "granted") {
        try {
          const permission = await Notification.requestPermission();
          console.log("Notification permission status:", permission);
          if (permission !== "granted") {
            console.warn("Notification permission denied");
          }
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      }
    };

    // Initialize service worker
    const initializeServiceWorker = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('PWA: Service Worker registered with scope:', registration.scope);
        } catch (error) {
          console.error('PWA: Service Worker registration failed:', error);
        }
      }
    };

    initializeNotifications();
    initializeServiceWorker();
  }, []);
  
  useEffect(() => {
    console.log("Notification check useEffect running");
    const checkNotification = async () => {
      try {
        console.log("Checking for notifications...");
        const response = await fetch("/api/proxy3");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Notification check result:", result);
        
        if (result.beep && Notification.permission === "granted") {
          new Notification("Hydration Reminder", {
            body: "Time to drink water! Stay hydrated.",
          });
        }
      } catch (error) {
        console.error("Error checking hydration notification:", error);
      }
    };

    // Check every minute (60000ms) instead of every second (1000ms)
    const interval = setInterval(checkNotification, 60000);
    
    // Initial check
    checkNotification();
    
    return () => {
      console.log("Cleaning up notification check interval");
      clearInterval(interval);
    };
  }, []);

  // Debug PWA requirements
  useEffect(() => {
    const debugPWA = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        console.log('Service Worker registered:', !!registration);
      }
      
      // Check manifest
      const manifestLink = document.querySelector('link[rel="manifest"]');
      console.log('Manifest found:', !!manifestLink);
      
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      console.log('Is running in standalone mode:', isStandalone);
    };

    debugPWA();
  }, []);

  // Enhanced PWA install prompt useEffect
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
      // Show the install button
      setShowInstallButton(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Already installed as PWA');
      setShowInstallButton(false);
    }

    // Log when the app is installed
    window.addEventListener('appinstalled', (e) => {
      console.log('PWA was installed');
      setShowInstallButton(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      // Show the install prompt
      const result = await installPrompt.prompt();
      console.log('Install prompt shown, user choice:', result);

      // Wait for the user to respond to the prompt
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      // Clear the saved prompt since it can't be used again
      setInstallPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-3xl text-[#389cfc] font-bold">SmartSipp</h1>
        <div className="flex items-center gap-2">
          {/* <Settings color="black" /> TO BE IMPLEMENTED*/}
          {/* <button className="w-6 h-6 bg-black rounded-full" /> TO BE IMPLEMENTED*/}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <WaterProgress/>
        <RecordsList />
      </main>

      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors z-50"
        >
          Install SmartSipp App
        </button>
      )}
    </div>
  );
}
