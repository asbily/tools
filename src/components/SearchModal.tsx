import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { ToolItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tools,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = tools.filter((t) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.shortDesc.toLowerCase().includes(q) ||
      t.categoryLabel.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }).slice(0, 10);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden"
      >
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name, utility or category..."
            className="flex-1 bg-transparent border-none text-sm text-[#111111] dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 dark:bg-neutral-900 border rounded text-neutral-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">
              No matching tools found for "{query}".
            </div>
          ) : (
            filtered.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTool(t);
                  onClose();
                }}
                className="p-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer flex items-center justify-between group transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#111111] dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white">
                      {t.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                      {t.categoryLabel}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                    {t.shortDesc}
                  </div>
                </div>
                <CornerDownLeft className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white transform group-hover:translate-x-0.5 transition" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
