import { initializeApp } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQjX59uIpAwMM3oYhFdzo2m3LyoK73Np4",
  authDomain: "focusforge-6f721.firebaseapp.com",
  projectId: "focusforge-6f721",
  storageBucket: "focusforge-6f721.firebasestorage.app",
  messagingSenderId: "649090067184",
  appId: "1:649090067184:web:cbbdef1d09b0d842493035",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Subscribes to auth state. Calls back with the user object, or null when
// signed out. Returns the unsubscribe function.
export function watchAuth(cb) {
  return onAuthStateChanged(auth, (user) => cb(user || null));
}

export function googleSignIn() {
  return signInWithPopup(auth, provider);
}

export function googleSignOut() {
  return signOut(auth);
}

export async function loadState(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().payload : null;
}

export async function saveState(uid, state) {
  await setDoc(doc(db, "users", uid), { payload: state, updatedAt: Date.now() });
}
