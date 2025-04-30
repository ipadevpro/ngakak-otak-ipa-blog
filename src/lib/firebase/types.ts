
// Define story type for better type checking
export interface Story {
  id: string;
  title: string;
  content?: string;
  subtitle?: string;
  topicId?: string;
  tags?: string[];
  learningPoints?: string;
  likes: number;
  likedBy?: string[];
  feedbackCount?: number;
  [key: string]: any; // Allow for other properties
}

// Define feedback type for better type checking
export interface Feedback {
  id?: string;
  storyId: string;
  storyTitle: string;
  userId: string;
  content: string;
  createdAt: string;
  [key: string]: any; // Allow for other properties
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  [key: string]: any;
}
