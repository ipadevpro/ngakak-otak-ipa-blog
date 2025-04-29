
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { addTopic, addStory, getTopics } from '@/lib/firebase';
import { Loader2, Plus, Book, BookOpen } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'physics' | 'biology' | 'chemistry';
}

const AdminPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  
  // Topic form state
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [topicEmoji, setTopicEmoji] = useState('🧪');
  const [topicCategory, setTopicCategory] = useState<'physics' | 'biology' | 'chemistry'>('physics');
  
  // Story form state
  const [storyTitle, setStoryTitle] = useState('');
  const [storySubtitle, setStorySubtitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storyTopicId, setStoryTopicId] = useState('');
  const [storyTags, setStoryTags] = useState('');
  const [storyLearningPoints, setStoryLearningPoints] = useState('');

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !currentUser) {
      navigate('/login');
    }

    // Fetch topics for the dropdown
    const fetchTopics = async () => {
      try {
        const topicsData = await getTopics();
        setTopics(topicsData as Topic[]);
        
        // Set first topic as default if available
        if (topicsData.length > 0) {
          setStoryTopicId(topicsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [currentUser, navigate, loading]);

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addTopic({
        title: topicTitle,
        description: topicDescription,
        emoji: topicEmoji,
        category: topicCategory
      });

      toast.success("Topik berhasil ditambahkan! 🎉");
      
      // Reset form
      setTopicTitle('');
      setTopicDescription('');
      setTopicEmoji('🧪');
      setTopicCategory('physics');
      
      // Refresh topics list
      const topicsData = await getTopics();
      setTopics(topicsData as Topic[]);
    } catch (error) {
      console.error("Error adding topic:", error);
      toast.error("Gagal menambahkan topik. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addStory({
        title: storyTitle,
        subtitle: storySubtitle,
        content: storyContent,
        topicId: storyTopicId,
        tags: storyTags.split(',').map(tag => tag.trim()),
        learningPoints: storyLearningPoints
      });

      toast.success("Cerita lo udah naik pangkat jadi konten 🤓");
      
      // Reset form
      setStoryTitle('');
      setStorySubtitle('');
      setStoryContent('');
      setStoryTags('');
      setStoryLearningPoints('');
    } catch (error) {
      console.error("Error adding story:", error);
      toast.error("Gagal menambahkan cerita. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  // Sample list of emojis for topic selection
  const emojiOptions = ['🧪', '⚗️', '🔬', '🔭', '🧫', '🧬', '🫁', '🧠', '⚡', '🔋', '🧲', '🦠', '🍄', '🌱', '🍃'];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Tabs defaultValue="topics">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="topics">
                <Book className="h-4 w-4 mr-2" />
                <span>Kelola Topik</span>
              </TabsTrigger>
              <TabsTrigger value="stories">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Kelola Cerita</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="topics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tambah Topik Baru</CardTitle>
                  <CardDescription>
                    Buat topik IPA baru untuk mengelompokkan cerita-cerita kece
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTopic} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Judul Topik</Label>
                      <Input
                        id="title"
                        placeholder="Contoh: Gaya & Gerak"
                        value={topicTitle}
                        onChange={(e) => setTopicTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi Gaya Gen Z</Label>
                      <Textarea
                        id="description"
                        placeholder="Contoh: Kisah absurd tentang anak jatuh cinta gara-gara Hukum Newton 💥"
                        value={topicDescription}
                        onChange={(e) => setTopicDescription(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emoji">Pilih Emoji</Label>
                        <Select value={topicEmoji} onValueChange={setTopicEmoji}>
                          <SelectTrigger id="emoji">
                            <SelectValue placeholder="Pilih emoji" />
                          </SelectTrigger>
                          <SelectContent>
                            {emojiOptions.map((emoji) => (
                              <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Select 
                          value={topicCategory} 
                          onValueChange={(value) => setTopicCategory(value as 'physics' | 'biology' | 'chemistry')}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="physics">Fisika</SelectItem>
                            <SelectItem value="biology">Biologi</SelectItem>
                            <SelectItem value="chemistry">Kimia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Tambah Topik</span>
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tambah Cerita Baru</CardTitle>
                  <CardDescription>
                    Tulis cerita kocak yang nge-relate sama anak zaman now dengan sentuhan IPA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddStory} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="storyTitle">Judul Cerita</Label>
                      <Input
                        id="storyTitle"
                        placeholder="Contoh: Cinta di Atas Trolley: Sebuah Perjuangan Gaya Gesek"
                        value={storyTitle}
                        onChange={(e) => setStoryTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="storySubtitle">Subtitle Edukatif</Label>
                      <Input
                        id="storySubtitle"
                        placeholder="Contoh: Materi: Gaya dan Gerak – Hukum Newton 1"
                        value={storySubtitle}
                        onChange={(e) => setStorySubtitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="storyTopic">Topik</Label>
                      <Select value={storyTopicId} onValueChange={setStoryTopicId}>
                        <SelectTrigger id="storyTopic">
                          <SelectValue placeholder="Pilih topik" />
                        </SelectTrigger>
                        <SelectContent>
                          {topics.map((topic) => (
                            <SelectItem key={topic.id} value={topic.id}>{topic.title}</SelectItem>
                          ))}
                          {/* Fallback options if no topics from Firebase yet */}
                          {topics.length === 0 && [
                            <SelectItem key="physics1" value="physics1">Gaya & Gerak</SelectItem>,
                            <SelectItem key="biology1" value="biology1">Sistem Pernapasan</SelectItem>,
                            <SelectItem key="chemistry1" value="chemistry1">Unsur & Senyawa</SelectItem>
                          ]}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storyTags">Tags (pisahkan dengan koma)</Label>
                      <Input
                        id="storyTags"
                        placeholder="Contoh: Fisika, Gaya, Newton"
                        value={storyTags}
                        onChange={(e) => setStoryTags(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="storyContent">Konten Cerita (Markdown)</Label>
                      <Textarea
                        id="storyContent"
                        placeholder="Tulis cerita dengan gaya Raditya Dika di sini..."
                        className="min-h-[200px]"
                        value={storyContent}
                        onChange={(e) => setStoryContent(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="learningPoints">Poin Pembelajaran (Markdown)</Label>
                      <Textarea
                        id="learningPoints"
                        placeholder="Contoh: 1. **Hukum I Newton**: Benda akan tetap diam atau bergerak lurus..."
                        className="min-h-[100px]"
                        value={storyLearningPoints}
                        onChange={(e) => setStoryLearningPoints(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Tambah Cerita</span>
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
