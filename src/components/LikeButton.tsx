
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { likeStory, unlikeStory, checkIfLiked } from '@/lib/firebase';

interface LikeButtonProps {
  storyId: string;
  initialLikes?: number;
}

export default function LikeButton({ storyId, initialLikes = 0 }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate a simple anonymous user ID if not logged in
  const userId = localStorage.getItem('anonymous_user_id') || 
    `anon_${Math.random().toString(36).substring(2, 15)}`;
  
  useEffect(() => {
    if (!localStorage.getItem('anonymous_user_id')) {
      localStorage.setItem('anonymous_user_id', userId);
    }
    
    // Check if user already liked this story
    const checkLikeStatus = async () => {
      const liked = await checkIfLiked(storyId, userId);
      setIsLiked(liked);
    };
    
    checkLikeStatus();
  }, [storyId, userId]);

  const handleLike = async () => {
    setIsLoading(true);
    try {
      if (isLiked) {
        await unlikeStory(storyId, userId);
        setLikes(prev => prev - 1);
        setIsLiked(false);
        toast.success('Gak jadi suka 💔');
      } else {
        await likeStory(storyId, userId);
        setLikes(prev => prev + 1);
        setIsLiked(true);
        toast.success('Thanksss suka ceritanya! 💙');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Gagal like cerita. Coba lagi ya!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={isLiked ? "default" : "outline"} 
      size="sm" 
      className={`flex items-center gap-1 ${isLiked ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart 
        className={`h-4 w-4 ${isLiked ? 'fill-white' : ''}`} 
      />
      <span>{likes}</span>
    </Button>
  );
}
