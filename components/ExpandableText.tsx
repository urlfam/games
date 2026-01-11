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
  limit = 280, 
  className = "text-gray-300 text-lg leading-relaxed" 
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  // If content is short enough, just show it all without buttons
  if (content.length <= limit) {
    return <p className={className}>{content}</p>;
  }

  return (
    <div className="mb-6">
      <p className={className}>
        {isExpanded ? content : `${content.substring(0, limit)}...`}
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
