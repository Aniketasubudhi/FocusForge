import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
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

export function ensureSignedIn() {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user) return resolve(user);
      signInAnonymously(auth).then((cred) => resolve(cred.user)).catch(reject);
    });
  });
}

export async function loadState(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().payload : null;
}

export async function saveState(uid, state) {
  await setDoc(doc(db, "users", uid), { payload: state, updatedAt: Date.now() });
}