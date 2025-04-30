import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicCard from '@/components/TopicCard';
import { getTopics } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface Topic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'physics' | 'biology' | 'chemistry';
}

const TopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await getTopics();
        setTopics(topicsData as Topic[]);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const displayTopics = topics.length > 0 ? topics : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Topik IPA</h1>
              <p className="text-muted-foreground mt-2">
                Pilih materi yang bikin lo penasaran (atau yang muncul di ujian besok 😉)
              </p>
            </div>
          </div>
          
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Loading skeletons
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl border p-4">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : (
              // Actual topic cards
              displayTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  id={topic.id}
                  title={topic.title}
                  description={topic.description}
                  emoji={topic.emoji}
                  category={topic.category}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TopicsPage;
