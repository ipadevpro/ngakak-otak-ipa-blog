
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";
import { Story } from "./types";

export const getStoriesStatistics = async () => {
  const storiesCollection = collection(db, "stories");
  const storiesSnapshot = await getDocs(storiesCollection);
  const stories = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
  
  // Get all feedback
  const feedbackCollection = collection(db, "feedback");
  const feedbackSnapshot = await getDocs(feedbackCollection);
  const feedback = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Calculate statistics
  const totalStories = stories.length;
  const totalLikes = stories.reduce((acc, story) => acc + (story.likes || 0), 0);
  const totalFeedback = feedback.length;
  
  // Group feedback by story
  const feedbackByStory = feedback.reduce((acc: {[key: string]: number}, item: any) => {
    if (!acc[item.storyId]) {
      acc[item.storyId] = 0;
    }
    acc[item.storyId]++;
    return acc;
  }, {});
  
  // Add feedback count to stories
  const storiesWithFeedback = stories.map(story => ({
    ...story,
    feedbackCount: feedbackByStory[story.id] || 0
  }));
  
  const topStories = [...storiesWithFeedback]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5)
    .map(story => ({
      id: story.id,
      title: story.title || "Untitled Story",
      likes: story.likes || 0,
      feedbackCount: story.feedbackCount || 0
    }));
  
  // Get recent feedback
  const recentFeedback = [...feedback]
    .sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5)
    .map((item: any) => ({
      id: item.id,
      storyTitle: item.storyTitle || "Unknown Story",
      content: item.content,
      createdAt: item.createdAt
    }));
  
  return {
    totalStories,
    totalLikes,
    totalFeedback,
    topStories,
    recentFeedback
  };
};
