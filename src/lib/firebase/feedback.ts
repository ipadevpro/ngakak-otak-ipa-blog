
import { collection, addDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./config";
import { Feedback } from "./types";

export const addFeedback = async (feedback: Omit<Feedback, 'id'>) => {
  return addDoc(collection(db, "feedback"), feedback);
};

export const getFeedback = async (storyId: string) => {
  const feedbackCollection = collection(db, "feedback");
  const feedbackQuery = query(
    feedbackCollection, 
    where("storyId", "==", storyId),
    orderBy("createdAt", "desc")
  );
  const feedbackSnapshot = await getDocs(feedbackQuery);
  return feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllFeedback = async (limitCount = 50) => {
  const feedbackCollection = collection(db, "feedback");
  const feedbackQuery = query(
    feedbackCollection,
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const feedbackSnapshot = await getDocs(feedbackQuery);
  return feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
