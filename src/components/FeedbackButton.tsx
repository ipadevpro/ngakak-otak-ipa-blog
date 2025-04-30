
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { addFeedback } from '@/lib/firebase';

interface FeedbackButtonProps {
  storyId: string;
  storyTitle: string;
}

export default function FeedbackButton({ storyId, storyTitle }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate a simple anonymous user ID if not logged in
  const userId = localStorage.getItem('anonymous_user_id') || 
    `anon_${Math.random().toString(36).substring(2, 15)}`;
  
  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error('Tulis komentarnya dulu dong!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addFeedback({
        storyId,
        storyTitle,
        userId,
        content: feedback,
        createdAt: new Date().toISOString()
      });
      
      toast.success('Makasih feedbacknya! 🙏');
      setFeedback('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Gagal kirim feedback. Coba lagi ya!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-4 w-4" />
        <span>Feedback</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kasih Feedback</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              className="min-h-[120px]"
              placeholder="Ceritanya keren tapi mungkin bisa ditambahin..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button 
              disabled={isSubmitting} 
              onClick={handleSubmitFeedback}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
