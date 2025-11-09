'use client';

import React from 'react';

interface BlogSkeletonProps {
  count?: number;
  showCategory?: boolean;
  showAuthor?: boolean;
  className?: string;
}

export default function BlogSkeleton({
  count = 6,
  showCategory = true,
  showAuthor = true,
  className = ''
}: BlogSkeletonProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            {/* Featured Image Skeleton */}
            <div className="aspect-video bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
              {/* Category Skeleton */}
              {showCategory && (
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
              )}

              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-4/5"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Excerpt Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>

              {/* Meta Information Skeleton */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {/* Author Skeleton */}
                {showAuthor && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                )}

                {/* Date and Reading Time Skeleton */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-14"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Individual post skeleton for single post page
export function BlogPostSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="aspect-video lg:aspect-[16/9] bg-gray-200"></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Article Header */}
        <div className="mb-8 space-y-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            <div className="h-8 bg-gray-200 rounded-full w-32"></div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-200 rounded w-4/5"></div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Author */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-28"></div>
            </div>

            {/* Reading time */}
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>

        {/* Article Content */}
        <div className="space-y-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2">
              {/* Heading */}
              {index % 3 === 0 && (
                <div className="h-8 bg-gray-200 rounded w-3/5"></div>
              )}

              {/* Paragraph */}
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded w-11/12"></div>
                <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                {index % 2 === 0 && (
                  <>
                    <div className="h-5 bg-gray-200 rounded w-9/12"></div>
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                  </>
                )}
              </div>

              {/* Image placeholder */}
              {index % 4 === 0 && (
                <div className="h-64 bg-gray-200 rounded-lg my-6"></div>
              )}
            </div>
          ))}
        </div>

        {/* Tags Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="h-7 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-8 bg-gray-200 rounded-full w-20"></div>
            ))}
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="h-7 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="flex flex-wrap gap-4">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-36"></div>
            <div className="h-10 bg-gray-200 rounded w-34"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blog page skeleton for listing pages
export function BlogPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4">
            <div className="h-12 bg-purple-400 rounded w-48 mx-auto"></div>
            <div className="h-8 bg-purple-400 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BlogSkeleton count={9} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>

            {/* Categories */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="h-6 bg-gray-200 rounded w-28"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-6 bg-gray-200 rounded-full w-16"></div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-lg text-white">
              <div className="space-y-4">
                <div className="h-6 bg-purple-400 rounded w-40"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-purple-400 rounded w-full"></div>
                  <div className="h-4 bg-purple-400 rounded w-4/5"></div>
                </div>
                <div className="h-10 bg-purple-400 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}