import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Heart } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

interface StatsCardProps {
  totalStories: number;
  totalLikes: number;
  totalFeedback?: number;
  topStories: {
    id: string;
    title: string;
    likes: number;
    feedbackCount?: number;
  }[];
  recentFeedback?: {
    id: string;
    storyTitle: string;
    content: string;
    createdAt: string;
  }[];
  loading?: boolean;
}

export default function StatsCard({ 
  totalStories, 
  totalLikes, 
  totalFeedback = 0,
  topStories,
  recentFeedback = [],
  loading = false 
}: StatsCardProps) {
  
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'dd MMM yyyy, HH:mm');
      }
      return 'Invalid date';
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-blue-800 dark:text-blue-300">
          Statistik Cerita
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/30">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalStories}</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">Total Cerita</span>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-900/30">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalLikes}</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">Total Likes</span>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-900/30">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalFeedback}</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">Total Feedback</span>
            </CardContent>
          </Card>
        </div>
        
        <div className="border-t pt-6 mt-4">
          <h3 className="font-medium mb-4 text-blue-800 dark:text-blue-300">Top 5 Cerita Populer</h3>
          
          <div className="grid gap-3">
            {topStories.map((story, index) => (
              <Card key={story.id} className={`p-3 border-l-4 ${index === 0 ? 'border-l-blue-500' : index === 1 ? 'border-l-blue-400' : 'border-l-blue-300'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{story.title}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{story.feedbackCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="h-3.5 w-3.5 text-pink-500" />
                      <span>{story.likes}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {topStories.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Belum ada cerita yang populer.
              </p>
            )}
          </div>
        </div>
        
        {recentFeedback.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <h3 className="font-medium mb-3 text-blue-800 dark:text-blue-300">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Feedback Terbaru</span>
              </div>
            </h3>
            
            <div className="space-y-3">
              {recentFeedback.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="mb-1 text-sm font-medium text-blue-700 dark:text-blue-400">
                    {item.storyTitle}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.content}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
