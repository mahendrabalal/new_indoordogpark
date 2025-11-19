'use client';

interface SearchHighlightProps {
  text: string;
  searchTerm: string;
}

/**
 * Component to highlight search terms within text
 * Uses dangerouslySetInnerHTML safely with sanitized content
 */
export default function SearchHighlight({ text, searchTerm }: SearchHighlightProps) {
  if (!searchTerm || !text) {
    return <>{text}</>;
  }

  // Escape special regex characters in search term
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create case-insensitive regex to find all occurrences
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
  
  // Split text by search term and wrap matches in <mark> tags
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the search term (case-insensitive)
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return <mark key={index}>{part}</mark>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}













