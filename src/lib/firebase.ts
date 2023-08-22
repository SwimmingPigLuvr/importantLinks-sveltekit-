import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable, type Readable, derived } from "svelte/store";
import type { CustomTheme } from "./theme";

interface MyUser {
  uid?: string;
  userData?: UserData;
}

const firebaseConfig = {
  apiKey: "AIzaSyBU5hSr2-g1e8VWIKzhcYuldgynMma5S_4",
  authDomain: "importantlinks-bb682.firebaseapp.com",
  projectId: "importantlinks-bb682",
  storageBucket: "importantlinks-bb682.appspot.com",
  messagingSenderId: "16885017145",
  appId: "1:16885017145:web:8a214c4cdae73f46673be8",
  measurementId: "G-F7YLZ14ZHP",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

/**
 * @returns a store with the current firebase user
 */

function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in browser");
    const { subscribe } = writable<MyUser | null>(null);
    return {
      subscribe,
    };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user: Readable<MyUser | null> = userStore();

/**
 * @param  {string} path document path or reference
 * @returns a store with realtime updates on document data
 */

export function docStore<T>(path: string) {
  let unsubscribe: () => void;

  const docRef = doc(db, path);

  const { subscribe } = writable<T | null>(null, (set) => {
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };
}

export interface LinkData {
  [x: string]: string | undefined;
  title: string;
  url: string;
  icon: string;
}

export interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  links: LinkData[];
  customTheme: CustomTheme;
  theme: string;
}

export interface DataToSave {
  customTheme: CustomTheme;
}

export const userData: Readable<UserData | null> = derived(
  user,
  ($user, set) => {
    if ($user) {
      return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
      set(null);
    }
  },
);

export const userTheme: Readable<string | null> = derived(
  userData,
  ($userData) => $userData?.theme || null,
);
