'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, onValue, Database, off } from 'firebase/database';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface FirebaseContextType {
  app: FirebaseApp | null;
  db: Database | null;
  messages: any[];
  isConfigured: boolean;
  path: string;
  setPath: (path: string) => void;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  db: null,
  messages: [],
  isConfigured: false,
  path: 'messages',
  setPath: () => {},
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [db, setDb] = useState<Database | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [path, setPath] = useState('messages');

  useEffect(() => {
    const config: FirebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    };

    if (config.apiKey && config.databaseURL) {
      try {
        const firebaseApp = getApps().length === 0 ? initializeApp(config) : getApps()[0];
        const database = getDatabase(firebaseApp);
        setApp(firebaseApp);
        setDb(database);
        setIsConfigured(true);
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (db && path) {
      const messagesRef = ref(db, path);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          if (typeof data === 'object') {
            const list = Object.entries(data).map(([key, value]: [string, any]) => ({
              id: key,
              ...(typeof value === 'object' ? value : { value }),
            })).reverse();
            setMessages(list);
          } else {
            setMessages([{ id: 'root', value: data }]);
          }
        } else {
          setMessages([]);
        }
      });

      return () => off(messagesRef);
    }
  }, [db, path]);

  return (
    <FirebaseContext.Provider value={{ app, db, messages, isConfigured, path, setPath }}>
      {children}
    </FirebaseContext.Provider>
  );
};
