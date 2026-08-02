'use client';

import { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Using the same auth token approach as the rest of the app
      const token = localStorage.getItem('supabase.auth.token');
      const parsedToken = token ? JSON.parse(token) : null;
      const accessToken = parsedToken?.currentSession?.access_token;

      const headers: HeadersInit = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch('/api/admin/uploads/email-attachments', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 p-2 bg-gray-50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive('bold') ? 'bg-purple-200 text-purple-900' : 'text-gray-700 hover:bg-gray-200'}`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded text-sm font-semibold italic ${editor.isActive('italic') ? 'bg-purple-200 text-purple-900' : 'text-gray-700 hover:bg-gray-200'}`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-2 py-1 rounded text-sm font-semibold line-through ${editor.isActive('strike') ? 'bg-purple-200 text-purple-900' : 'text-gray-700 hover:bg-gray-200'}`}
      >
        S
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive('bulletList') ? 'bg-purple-200 text-purple-900' : 'text-gray-700 hover:bg-gray-200'}`}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive('orderedList') ? 'bg-purple-200 text-purple-900' : 'text-gray-700 hover:bg-gray-200'}`}
      >
        1. List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive('blockquote') ? 'bg-purple-200 text-purple-900' : 'text-gray-700 hover:bg-gray-200'}`}
      >
        Quote
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/gif, image/webp" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`px-2 py-1 rounded text-sm font-semibold text-gray-700 hover:bg-gray-200 flex items-center gap-1 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isUploading ? 'Uploading...' : '🖼️ Image'}
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full h-auto',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none p-4 min-h-[250px] max-w-none',
      },
    },
  });

  return (
    <div className="bg-white rounded-lg flex flex-col h-full w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  );
}
