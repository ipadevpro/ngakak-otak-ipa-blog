import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoryCard from '@/components/StoryCard';
import { getStoriesByTopic } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface Story {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
}

const StoriesPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [topicTitle, setTopicTitle] = useState("Materi IPA");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        if (topicId) {
          const storiesData = await getStoriesByTopic(topicId);
          setStories(storiesData as Story[]);
          // Ideally we'd also fetch the topic name here
          // For now, we'll use the sample data below if empty
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [topicId]);

  const displayStories = stories;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{topicTitle}</h1>
              <p className="text-muted-foreground mt-2">
                Ini cerita serius kok... ya nggak terlalu sih 😅
              </p>
            </div>
          </div>
          
          <div className="mt-8 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {loading ? (
              // Loading skeletons
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl border p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))
            ) : displayStories.length > 0 ? (
              // Actual story cards
              displayStories.map((story) => (
                <StoryCard
                  key={story.id}
                  id={story.id}
                  title={story.title}
                  subtitle={story.subtitle}
                  tags={story.tags}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-lg text-muted-foreground">
                  Belum ada cerita untuk topik ini. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StoriesPage;
