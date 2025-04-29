
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm md:prose-base lg:prose-lg max-w-none ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
