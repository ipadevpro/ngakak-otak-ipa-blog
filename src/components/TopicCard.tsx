
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
  return (
    <Link to={`/topics/${id}`}>
      <Card className={`topic-card ${category} h-full hover:cursor-pointer`}>
        <CardContent className="p-4 flex flex-col h-full">
          <div className="text-4xl mb-4 animate-bounce-small">{emoji}</div>
          <CardTitle className="mb-2">{title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-auto">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
