
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { MessageSquare } from 'lucide-react';
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
  
  const chartData = topStories.map(story => ({
    name: story.title.length > 20 ? `${story.title.substring(0, 20)}...` : story.title,
    likes: story.likes || 0,
    feedback: story.feedbackCount || 0,
    fullTitle: story.title
  }));
  
  const chartConfig = {
    likes: {
      color: "#3B82F6"
    },
    feedback: {
      color: "#6366F1"
    }
  };
  
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
      <CardContent className="space-y-6">
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
        
        <div className="pt-2">
          <h3 className="font-medium mb-3 text-blue-800 dark:text-blue-300">Top 5 Cerita Populer</h3>
          
          <div className="h-[200px] w-full">
            <ChartContainer
              config={chartConfig}
            >
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 10 }}
                  height={70}
                />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          className="bg-white dark:bg-gray-800"
                        >
                          <div className="p-2">
                            <p className="font-medium">{payload[0]?.payload?.fullTitle}</p>
                            <p className="text-blue-600 dark:text-blue-400">
                              {payload[0]?.value} likes
                            </p>
                            <p className="text-indigo-600 dark:text-indigo-400">
                              {payload[0]?.payload?.feedback} feedback
                            </p>
                          </div>
                        </ChartTooltipContent>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="likes" fill="#3B82F6" barSize={30} radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(59, 130, 246, ${1 - index * 0.15})`} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
        
        {recentFeedback.length > 0 && (
          <div className="pt-4 border-t">
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
