'use client';

import { HeadingItem } from '@/lib/extract-headings';

interface BlogTableOfContentsProps {
  items: HeadingItem[];
}

export default function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  if (items.length === 0) return null;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-[#FFF5F2] border-2 border-[#FF5722]/20 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Table Of Contents</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level > 2 ? 'ml-4' : ''}>
            <button
              onClick={() => scrollToSection(item.id)}
              className="text-left text-sm text-gray-700 hover:text-[#FF5722] transition-colors w-full"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

