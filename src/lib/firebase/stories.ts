
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./config";

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

// Functions for likes
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
