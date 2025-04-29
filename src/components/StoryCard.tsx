
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StoryCardProps {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
}

export default function StoryCard({ id, title, subtitle, tags }: StoryCardProps) {
  return (
    <Link to={`/stories/${id}`}>
      <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full border-l-4 border-l-theme-purple">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
