
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, increment, arrayUnion, arrayRemove } from "firebase/firestore";

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

// Define story type for better type checking
interface Story {
  id: string;
  title: string;
  content?: string;
  subtitle?: string;
  topicId?: string;
  tags?: string[];
  learningPoints?: string;
  likes: number;
  likedBy?: string[];
  [key: string]: any; // Allow for other properties
}

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
  return addDoc(collection(db, "stories"), { ...story, likes: 0, likedBy: [] });
};

export const updateStory = async (storyId: string, data: any) => {
  const storyRef = doc(db, "stories", storyId);
  return updateDoc(storyRef, data);
};

export const deleteStory = async (storyId: string) => {
  const storyRef = doc(db, "stories", storyId);
  return deleteDoc(storyRef);
};

// New functions for likes
export const likeStory = async (storyId: string, userId: string) => {
  const storyRef = doc(db, "stories", storyId);
  return updateDoc(storyRef, {
    likes: increment(1),
    likedBy: arrayUnion(userId)
  });
};

export const unlikeStory = async (storyId: string, userId: string) => {
  const storyRef = doc(db, "stories", storyId);
  return updateDoc(storyRef, {
    likes: increment(-1),
    likedBy: arrayRemove(userId)
  });
};

export const checkIfLiked = async (storyId: string, userId: string) => {
  if (!userId) return false;
  const storyRef = doc(db, "stories", storyId);
  const storyDoc = await getDoc(storyRef);
  if (storyDoc.exists()) {
    const storyData = storyDoc.data();
    return storyData.likedBy && storyData.likedBy.includes(userId);
  }
  return false;
};

// Statistics functions
export const getStoriesStatistics = async () => {
  const storiesCollection = collection(db, "stories");
  const storiesSnapshot = await getDocs(storiesCollection);
  const stories = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
  
  // Calculate statistics
  const totalStories = stories.length;
  const totalLikes = stories.reduce((acc, story) => acc + (story.likes || 0), 0);
  const topStories = [...stories]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5)
    .map(story => ({
      id: story.id,
      title: story.title || "Untitled Story",
      likes: story.likes || 0
    }));
  
  return {
    totalStories,
    totalLikes,
    topStories
  };
};
