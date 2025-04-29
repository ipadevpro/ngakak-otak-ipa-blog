
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg1GsAGYfzCyV4BPDp_H93XcTiZTVAygU",
  authDomain: "webcerita-9e656.firebaseapp.com",
  projectId: "webcerita-9e656",
  storageBucket: "webcerita-9e656.firebasestorage.app",
  messagingSenderId: "209361690351",
  appId: "1:209361690351:web:1818f58e96d154f68bc51a",
  measurementId: "G-TKGJB2YRWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication functions
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

// Data functions
export const getTopics = async () => {
  const topicsCollection = collection(db, "topics");
  const topicsSnapshot = await getDocs(topicsCollection);
  return topicsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getStoriesByTopic = async (topicId: string) => {
  const storiesCollection = collection(db, "stories");
  const storiesQuery = query(storiesCollection, where("topicId", "==", topicId));
  const storiesSnapshot = await getDocs(storiesQuery);
  return storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getStory = async (storyId: string) => {
  const storyDoc = doc(db, "stories", storyId);
  const storySnapshot = await getDoc(storyDoc);
  if (storySnapshot.exists()) {
    return { id: storySnapshot.id, ...storySnapshot.data() };
  }
  return null;
};

export const addTopic = async (topic: any) => {
  return addDoc(collection(db, "topics"), topic);
};

export const updateTopic = async (topicId: string, data: any) => {
  const topicRef = doc(db, "topics", topicId);
  return updateDoc(topicRef, data);
};

export const deleteTopic = async (topicId: string) => {
  const topicRef = doc(db, "topics", topicId);
  return deleteDoc(topicRef);
};

export const addStory = async (story: any) => {
  return addDoc(collection(db, "stories"), story);
};

export const updateStory = async (storyId: string, data: any) => {
  const storyRef = doc(db, "stories", storyId);
  return updateDoc(storyRef, data);
};

export const deleteStory = async (storyId: string) => {
  const storyRef = doc(db, "stories", storyId);
  return deleteDoc(storyRef);
};
