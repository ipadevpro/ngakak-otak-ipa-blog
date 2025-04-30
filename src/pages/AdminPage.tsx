import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { addTopic, addStory, getTopics, deleteTopic, updateTopic, getStoriesByTopic, deleteStory, updateStory, getStory, getStoriesStatistics } from '@/lib/firebase';
import { Loader2, Plus, Book, BookOpen, Edit, Trash2, Save, BarChart } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'physics' | 'biology' | 'chemistry';
}

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

interface StatsData {
  totalStories: number;
  totalLikes: number;
  topStories: {
    id: string;
    title: string;
    likes: number;
  }[];
}

const AdminPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [statsData, setStatsData] = useState<StatsData>({
    totalStories: 0,
    totalLikes: 0,
    topStories: []
  });
  const [loadingStats, setLoadingStats] = useState(false);
  
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

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState('');
  const [currentStoryId, setCurrentStoryId] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('topics');

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
        if (topicsData.length > 0 && !storyTopicId) {
          setStoryTopicId(topicsData[0].id);
          // Fetch stories for the first topic
          fetchStories(topicsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
    fetchStatistics();
  }, [currentUser, navigate, loading]);

  const fetchStatistics = async () => {
    setLoadingStats(true);
    try {
      const stats = await getStoriesStatistics();
      setStatsData(stats as StatsData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchStories = async (topicId: string) => {
    try {
      const storiesData = await getStoriesByTopic(topicId);
      setStories(storiesData as Story[]);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const handleTopicChange = (value: string) => {
    setStoryTopicId(value);
    fetchStories(value);
  };

  const resetTopicForm = () => {
    setTopicTitle('');
    setTopicDescription('');
    setTopicEmoji('🧪');
    setTopicCategory('physics');
    setCurrentTopicId('');
    setIsEditing(false);
  };

  const resetStoryForm = () => {
    setStoryTitle('');
    setStorySubtitle('');
    setStoryContent('');
    setStoryTags('');
    setStoryLearningPoints('');
    setCurrentStoryId('');
    setIsEditing(false);
    setShowPreview(false);
  };

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
      resetTopicForm();
      
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

  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateTopic(currentTopicId, {
        title: topicTitle,
        description: topicDescription,
        emoji: topicEmoji,
        category: topicCategory
      });

      toast.success("Topik berhasil diupdate! 📝");
      
      // Reset form
      resetTopicForm();
      
      // Refresh topics list
      const topicsData = await getTopics();
      setTopics(topicsData as Topic[]);
    } catch (error) {
      console.error("Error updating topic:", error);
      toast.error("Gagal mengupdate topik. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!window.confirm("Yakin mau hapus topik ini? Semua cerita terkait juga akan terhapus!")) {
      return;
    }

    setLoading(true);
    try {
      await deleteTopic(topicId);
      
      toast.success("Topik berhasil dihapus!");
      
      // Refresh topics list
      const topicsData = await getTopics();
      setTopics(topicsData as Topic[]);
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Gagal menghapus topik. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setTopicTitle(topic.title);
    setTopicDescription(topic.description);
    setTopicEmoji(topic.emoji);
    setTopicCategory(topic.category);
    setCurrentTopicId(topic.id);
    setIsEditing(true);
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
        learningPoints: storyLearningPoints,
        likes: 0
      });

      toast.success("Cerita lo udah naik pangkat jadi konten 🤓");
      
      // Reset form
      resetStoryForm();
      
      // Refresh stories list and statistics
      fetchStories(storyTopicId);
      fetchStatistics();
    } catch (error) {
      console.error("Error adding story:", error);
      toast.error("Gagal menambahkan cerita. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateStory(currentStoryId, {
        title: storyTitle,
        subtitle: storySubtitle,
        content: storyContent,
        topicId: storyTopicId,
        tags: storyTags.split(',').map(tag => tag.trim()),
        learningPoints: storyLearningPoints
      });

      toast.success("Cerita berhasil diupdate! 📚");
      
      // Reset form
      resetStoryForm();
      
      // Refresh stories list and statistics
      fetchStories(storyTopicId);
      fetchStatistics();
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error("Gagal mengupdate cerita. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!window.confirm("Yakin mau hapus cerita ini?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteStory(storyId);
      
      toast.success("Cerita berhasil dihapus!");
      
      // Refresh stories list and statistics
      fetchStories(storyTopicId);
      fetchStatistics();
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Gagal menghapus cerita. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStory = async (storyId: string) => {
    setLoading(true);
    try {
      const story = await getStory(storyId) as Story;
      
      if (story) {
        setStoryTitle(story.title);
        setStorySubtitle(story.subtitle);
        setStoryContent(story.content);
        setStoryTopicId(story.topicId);
        setStoryTags(story.tags.join(', '));
        setStoryLearningPoints(story.learningPoints);
        setCurrentStoryId(storyId);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching story:", error);
      toast.error("Gagal mengambil data cerita. Coba lagi ya!");
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
          <h1 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-300">Admin Dashboard</h1>
          
          {/* Stats Card */}
          <div className="mb-8">
            <StatsCard 
              totalStories={statsData.totalStories} 
              totalLikes={statsData.totalLikes} 
              topStories={statsData.topStories}
              loading={loadingStats}
            />
          </div>
          
          <Tabs defaultValue="topics" value={activeTab} onValueChange={setActiveTab}>
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
            
            <TabsContent value="topics" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{isEditing ? 'Edit Topik' : 'Tambah Topik Baru'}</CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? 'Edit topik IPA yang sudah ada'
                      : 'Buat topik IPA baru untuk mengelompokkan cerita-cerita kece'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={isEditing ? handleUpdateTopic : handleAddTopic} className="space-y-4">
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
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : isEditing ? (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            <span>Update Topik</span>
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Tambah Topik</span>
                          </>
                        )}
                      </Button>
                      
                      {isEditing && (
                        <Button type="button" variant="outline" onClick={resetTopicForm}>
                          Batal
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Topic List */}
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Topik</CardTitle>
                  <CardDescription>
                    Kelola semua topik IPA yang tersedia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {topics.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Belum ada topik. Yuk, tambahkan topik pertama kamu!
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Emoji</TableHead>
                          <TableHead>Judul</TableHead>
                          <TableHead>Kategori</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topics.map((topic) => (
                          <TableRow key={topic.id}>
                            <TableCell className="text-2xl">{topic.emoji}</TableCell>
                            <TableCell className="font-medium">{topic.title}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${
                                topic.category === 'physics' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : topic.category === 'biology' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-purple-100 text-purple-800'
                              }`}>
                                {topic.category === 'physics' 
                                  ? 'Fisika' 
                                  : topic.category === 'biology' 
                                    ? 'Biologi' 
                                    : 'Kimia'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditTopic(topic)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteTopic(topic.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stories" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{isEditing ? 'Edit Cerita' : 'Tambah Cerita Baru'}</CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? 'Edit cerita yang sudah ada'
                      : 'Tulis cerita kocak yang nge-relate sama anak zaman now dengan sentuhan IPA'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={isEditing ? handleUpdateStory : handleAddStory} className="space-y-4">
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
                      <Select value={storyTopicId} onValueChange={handleTopicChange}>
                        <SelectTrigger id="storyTopic">
                          <SelectValue placeholder="Pilih topik" />
                        </SelectTrigger>
                        <SelectContent>
                          {topics.map((topic) => (
                            <SelectItem key={topic.id} value={topic.id}>{topic.title}</SelectItem>
                          ))}
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
                      <div className="flex justify-between items-center">
                        <Label htmlFor="storyContent">Konten Cerita (Markdown)</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          {showPreview ? 'Edit Mode' : 'Preview'}
                        </Button>
                      </div>
                      
                      {showPreview ? (
                        <Card className="border p-4 min-h-[200px]">
                          <MarkdownRenderer content={storyContent} />
                        </Card>
                      ) : (
                        <Textarea
                          id="storyContent"
                          placeholder="Tulis cerita dengan gaya Raditya Dika di sini..."
                          className="min-h-[200px]"
                          value={storyContent}
                          onChange={(e) => setStoryContent(e.target.value)}
                          required
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="learningPoints">Poin Pembelajaran (Markdown)</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          {showPreview ? 'Edit Mode' : 'Preview'}
                        </Button>
                      </div>
                      
                      {showPreview ? (
                        <Card className="border p-4 min-h-[100px]">
                          <MarkdownRenderer content={storyLearningPoints} />
                        </Card>
                      ) : (
                        <Textarea
                          id="learningPoints"
                          placeholder="Contoh: 1. **Hukum I Newton**: Benda akan tetap diam atau bergerak lurus..."
                          className="min-h-[100px]"
                          value={storyLearningPoints}
                          onChange={(e) => setStoryLearningPoints(e.target.value)}
                          required
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : isEditing ? (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            <span>Update Cerita</span>
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Tambah Cerita</span>
                          </>
                        )}
                      </Button>
                      
                      {isEditing && (
                        <Button type="button" variant="outline" onClick={resetStoryForm}>
                          Batal
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Story List */}
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Cerita</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>Kelola cerita berdasarkan topik</span>
                    <div className="w-[200px]">
                      <Select value={storyTopicId} onValueChange={handleTopicChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih topik" />
                        </SelectTrigger>
                        <SelectContent>
                          {topics.map((topic) => (
                            <SelectItem key={topic.id} value={topic.id}>{topic.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stories.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Belum ada cerita untuk topik ini. Yuk, tambahkan cerita pertama!
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Judul</TableHead>
                          <TableHead>Subtitle</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Likes</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stories.map((story) => (
                          <TableRow key={story.id}>
                            <TableCell className="font-medium">{story.title}</TableCell>
                            <TableCell>{story.subtitle}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {story.tags.map((tag, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs font-medium">
                                {story.likes || 0} ❤️
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditStory(story.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteStory(story.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">Preview</Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>{story.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <h3 className="text-sm text-muted-foreground mb-4">{story.subtitle}</h3>
                                      <MarkdownRenderer content={story.content} />
                                      
                                      <div className="mt-8 border-t pt-4">
                                        <h4 className="font-semibold mb-2">Poin Pembelajaran:</h4>
                                        <MarkdownRenderer content={story.learningPoints} />
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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
