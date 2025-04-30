
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./config";
import { Topic } from "./types";

export const getTopics = async () => {
  const topicsCollection = collection(db, "topics");
  const topicsSnapshot = await getDocs(topicsCollection);
  return topicsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
