'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  content: string;
  limit?: number;
  className?: string;
}

export default function ExpandableText({ 
  content, 
  limit = 28, 
  className = "text-gray-300 text-lg leading-relaxed" 
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  const words = content.split(/\s+/);
  
  // If word count is less than or equal to limit, show all without buttons
  if (words.length <= limit) {
    return <p className={className}>{content}</p>;
  }

  const truncatedContent = words.slice(0, limit).join(' ') + '...';

  return (
    <div className="mb-6">
      <p className={className}>
        {isExpanded ? content : truncatedContent}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors text-sm"
      >
        {isExpanded ? (
          <>
            Show Less <ChevronUp size={16} />
          </>
        ) : (
          <>
            Show More <ChevronDown size={16} />
          </>
        )}
      </button>
    </div>
  );
}
