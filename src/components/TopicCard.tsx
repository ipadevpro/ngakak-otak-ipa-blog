
import { Link } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'physics' | 'biology' | 'chemistry';
}

export default function TopicCard({ id, title, description, emoji, category }: TopicCardProps) {
  const getCategoryColorClass = () => {
    switch (category) {
      case 'physics':
        return 'border-blue-400 bg-blue-50 dark:bg-blue-950';
      case 'biology':
        return 'border-green-400 bg-green-50 dark:bg-green-950';
      case 'chemistry':
        return 'border-purple-400 bg-purple-50 dark:bg-purple-950';
      default:
        return 'border-gray-400';
    }
  };
  
  return (
    <Link to={`/topics/${id}`}>
      <Card className={`topic-card h-full hover:cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-l-4 ${getCategoryColorClass()}`}>
        <CardContent className="p-4 flex flex-col h-full">
          <div className="text-4xl mb-4 animate-bounce-small">{emoji}</div>
          <CardTitle className="mb-2">{title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-auto">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
