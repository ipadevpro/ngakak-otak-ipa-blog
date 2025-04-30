
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-blue-800 dark:prose-headings:text-blue-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300 prose-a:transition-colors ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
