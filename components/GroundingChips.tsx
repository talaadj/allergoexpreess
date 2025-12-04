import React from 'react';
import { GroundingChunk } from '../types';

interface GroundingChipsProps {
  chunks: GroundingChunk[];
}

export const GroundingChips: React.FC<GroundingChipsProps> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {chunks.map((chunk, idx) => {
        if (chunk.web) {
          return (
            <a
              key={idx}
              href={chunk.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full text-xs transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              <span className="truncate max-w-[150px]">{chunk.web.title}</span>
            </a>
          );
        }
        if (chunk.maps) {
          return (
            <a
              key={idx}
              href={chunk.maps.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-full text-xs transition-colors"
            >
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="truncate max-w-[150px]">{chunk.maps.title}</span>
            </a>
          );
        }
        return null;
      })}
    </div>
  );
};
