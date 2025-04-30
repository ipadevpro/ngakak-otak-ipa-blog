import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import LikeButton from '@/components/LikeButton';
import FeedbackButton from '@/components/FeedbackButton';
import { getStory } from '@/lib/firebase';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, LightbulbIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Story {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  topicId: string;
  tags: string[];
  learningPoints: string;
  likes?: number;
}

const StoryPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        if (storyId) {
          const storyData = await getStory(storyId);
          setStory(storyData as Story);
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  const displayStory = story;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4 md:px-6 max-w-4xl">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link to={`/topics/${displayStory?.topicId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Cerita
            </Link>
          </Button>

          {loading ? (
            // Loading skeleton
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2 my-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{displayStory?.title}</h1>
                <p className="text-muted-foreground">{displayStory?.subtitle}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    {displayStory?.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <LikeButton storyId={displayStory?.id} initialLikes={displayStory?.likes || 0} />
                    <FeedbackButton storyId={displayStory?.id} storyTitle={displayStory?.title} />
                  </div>
                </div>
              </div>

              <Card className="sticky top-20 z-10 mb-8 border-theme-purple shadow-sm">
                <CardContent className="p-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="learning-points" className="border-none">
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center">
                          <LightbulbIcon className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Pelajaran IPA yang diselipin di cerita ini</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm space-y-2 pl-6">
                          <MarkdownRenderer content={displayStory?.learningPoints} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <div className="story-content">
                <MarkdownRenderer content={displayStory?.content} />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StoryPage;
