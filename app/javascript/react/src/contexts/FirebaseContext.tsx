import React, {
  ReactNode, createContext, useContext, useEffect, useState,
} from 'react';

import Bugsnag from '@bugsnag/js';
import {
  Analytics, getAnalytics, logEvent, setUserId, setUserProperties,
} from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';

import {
  signInAnonymously,
  getAuth,
  onAuthStateChanged,
  Auth,
} from 'firebase/auth';

import { User } from '../types/user.ts';

// TODO: retrieve from api auth endpoint
const firebaseConfig = {
  apiKey: window?.env?.REACT_APP_FIREBASE_API_KEY,
  authDomain: window?.env?.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: window?.env?.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: window?.env?.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window?.env?.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: window?.env?.REACT_APP_FIREBASE_APP_ID,
  measurementId: window?.env?.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

interface FirebaseContextProps {
  app: FirebaseApp; // holds two fns: app.name, app.options
  user?: User | null; // the base Firebase user object
  analytics: Analytics | null;
  signInAnon: () => Promise<void>;
  trackAnalyticsEvent: (eventName: string, data: Record<string, unknown>) => void;
}

interface FirebaseProviderProps {
  children: ReactNode;
}

const FireBaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = () => {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const [user, setUser] = useState<User | null | undefined>(null);
  const [userAuth, setuserAuth] = useState<Auth | null>(null);

  const signInAnon = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (userTmp) => {
      if (userTmp) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        Bugsnag.setUser(userTmp.uid, userTmp.email ?? '', userTmp.displayName ?? '');
        setUser(userTmp);
      } else {
        // User is signed out
        Bugsnag.setUser(undefined, undefined, undefined);
      }
    });

    signInAnonymously(auth).then(() => {
      setuserAuth(auth);
    }).catch((e) => Bugsnag.notify(e));
  };

  const trackAnalyticsEvent = (eventName: string, data: Record<string, unknown>) => {
    if (analytics) logEvent(analytics, eventName, data);
  };

  useEffect(() => {
    if (!user) signInAnon();
    if (user) setUserId(analytics, user.uid);
    if (user) setUserProperties(analytics, { ...user });
  }, [user]);

  const currentUser = userAuth?.currentUser;
  useEffect(() => {
    if (!user && currentUser) setUser(currentUser);
  }, [user, userAuth]);

  return <FireBaseContext.Provider value={{
    app, analytics, signInAnon, user, trackAnalyticsEvent,
  }} />;
};

export const useFirebase = () => {
  const context = useContext(FireBaseContext);
  if (!context) {
    throw new Error('useFirebase() must be used within a FirebaseProvider');
  }

  return context;
};
