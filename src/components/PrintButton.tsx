'use client';

import React from 'react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.print();
        }
      }}
      className="inline-flex items-center rounded-full bg-white px-8 py-4 font-bold text-violet-900 hover:bg-slate-100 shadow-lg transition-transform hover:scale-105"
    >
      <i className="bi bi-printer mr-2 text-xl"></i> Print / Save as PDF
    </button>
  );
}
