
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // For now, we'll use a simple component that renders markdown
  // In the future, this could be enhanced with syntax highlighting, custom components, etc.
  return (
    <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
