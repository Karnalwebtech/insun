import { useEffect, useState } from "react";

// Define the interface for session data
interface Item {
  value: string;
  expiry: number;
}

// This hook will ensure that sessionStorage is accessed only on the client side
export function useSessionStorage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will run only on the client side
    setIsClient(true);
  }, []);

  const setSessionData = (key: string, value: string, expiryInMinutes: number) => {
    if (!isClient) return; // Don't access sessionStorage on the server side
    const now = new Date();
    const item: Item = {
      value: value,
      expiry: now.getTime() + expiryInMinutes * 60 * 1000, // Convert minutes to milliseconds
    };
    sessionStorage.setItem(key, JSON.stringify(item)); // Convert object to string
  };

  const getSessionData = (key: string) => {
    if (!isClient) return null; // Don't access sessionStorage on the server side
    const token:string | null = sessionStorage.getItem(key);
    if (!token) return null;
    return JSON.parse(token); // Convert object from string back to object
  };

  return { setSessionData, getSessionData };
}