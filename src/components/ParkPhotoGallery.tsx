'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MediaAsset } from '@/types/dog-park';
import SubmitPhotoModal from './SubmitPhotoModal';

interface ParkPhotoGalleryProps {
  photos?: (MediaAsset | string)[] | null;
  primaryPhoto?: string | null;
  parkName: string;
  parkCity?: string;
  parkState?: string;
  listingSlug?: string;
}

export default function ParkPhotoGallery({
  photos = [],
  primaryPhoto,
  parkName,
  parkCity,
  parkState,
  listingSlug,
}: ParkPhotoGalleryProps) {
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const handleImageError = useCallback((url: string) => {
    setFailedImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  }, []);

  // Extract all valid image URLs and captions
  const initialPhotoList: { url: string; caption?: string }[] = [];

  if (photos && Array.isArray(photos)) {
    photos.forEach((item) => {
      if (typeof item === 'string' && item.trim()) {
        if (!initialPhotoList.some((p) => p.url === item.trim())) {
          initialPhotoList.push({ url: item.trim() });
        }
      } else if (item && typeof item === 'object' && 'url' in item && item.url) {
        if (!initialPhotoList.some((p) => p.url === item.url)) {
          initialPhotoList.push({ url: item.url, caption: item.caption });
        }
      }
    });
  }

  if (primaryPhoto && !initialPhotoList.some((p) => p.url === primaryPhoto)) {
    initialPhotoList.unshift({ url: primaryPhoto });
  }

  const photoList = initialPhotoList.filter((p) => !failedImages.includes(p.url));

  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }, []);

  const showNext = useCallback(() => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % photoList.length);
    }
  }, [activeLightboxIndex, photoList.length]);

  const showPrev = useCallback(() => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + photoList.length) % photoList.length);
    }
  }, [activeLightboxIndex, photoList.length]);

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, closeLightbox, showNext, showPrev]);

  // If no photos exist, show an inviting prompt for listing owners
  if (photoList.length === 0) {
    return (
      <>
        <div className="park-gallery-wrapper mb-8 w-full">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">
                <i className="bi bi-camera" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Do you have photos of {parkName}?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Help other pet parents by sharing photos of play areas, turf, and seating.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow flex-shrink-0 cursor-pointer"
            >
              <i className="bi bi-cloud-arrow-up-fill" /> Submit Photos
            </button>
          </div>
        </div>

        <SubmitPhotoModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          parkName={parkName}
          parkCity={parkCity}
          parkState={parkState}
          listingSlug={listingSlug}
        />
      </>
    );
  }

  const hasMultiple = photoList.length > 1;

  return (
    <>
      <div className="park-gallery-wrapper mb-8 w-full">
        {/* Single Photo Layout */}
        {photoList.length === 1 && (
          <div
            onClick={() => openLightbox(0)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 shadow-md transition-all hover:shadow-xl aspect-[16/9] sm:aspect-[21/9] max-h-[460px] w-full"
            role="button"
            tabIndex={0}
            aria-label={`View photo of ${parkName}`}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(0)}
          >
            <Image
              src={photoList[0].url}
              alt={photoList[0].caption || `${parkName} indoor dog park in ${parkCity || ''}, ${parkState || ''}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
              unoptimized
              onError={() => handleImageError(photoList[0].url)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white shadow">
              <i className="bi bi-arrows-fullscreen" />
              <span>Expand Photo</span>
            </div>

            {photoList[0].caption && (
              <div className="absolute bottom-4 left-4 z-10 max-w-lg rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs text-white">
                {photoList[0].caption}
              </div>
            )}
          </div>
        )}

        {/* Two Photos Layout */}
        {photoList.length === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-[320px] sm:h-[380px]">
            {photoList.map((photo, idx) => (
              <div
                key={photo.url}
                onClick={() => openLightbox(idx)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-900 shadow-md transition-all hover:shadow-xl h-full w-full"
                role="button"
                tabIndex={0}
                aria-label={`View photo ${idx + 1} of ${parkName}`}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(idx)}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || `${parkName} - Photo ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={idx === 0}
                  unoptimized
                  onError={() => handleImageError(photo.url)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-white">
                  <i className="bi bi-arrows-fullscreen mr-1" /> Photo {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Three or More Photos Layout (Airbnb Style Grid) */}
        {photoList.length >= 3 && (
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 h-[360px] md:h-[420px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-md">
            {/* Primary Big Photo (Left 2 cols) */}
            <div
              onClick={() => openLightbox(0)}
              className="group relative cursor-pointer md:col-span-2 lg:col-span-2 overflow-hidden bg-slate-900 h-full"
              role="button"
              tabIndex={0}
              aria-label={`Featured photo of ${parkName}`}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(0)}
            >
              <Image
                src={photoList[0].url}
                alt={photoList[0].caption || `${parkName} primary photo`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
                onError={() => handleImageError(photoList[0].url)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Stacked Secondary Photos (Right side 2 cols) */}
            <div className="hidden md:grid md:col-span-2 lg:col-span-2 grid-cols-2 gap-3 sm:gap-4 h-full">
              {photoList.slice(1, 5).map((photo, subIdx) => {
                const globalIndex = subIdx + 1;
                const isLastVisible = subIdx === 3 && photoList.length > 5;
                const remainingCount = photoList.length - 5;

                return (
                  <div
                    key={photo.url}
                    onClick={() => openLightbox(globalIndex)}
                    className="group relative cursor-pointer overflow-hidden bg-slate-900 rounded-xl h-full w-full"
                    role="button"
                    tabIndex={0}
                    aria-label={`View photo ${globalIndex + 1} of ${parkName}`}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(globalIndex)}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.caption || `${parkName} - photo ${globalIndex + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1200px) 25vw, 300px"
                      unoptimized
                      onError={() => handleImageError(photo.url)}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                    {isLastVisible && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white font-bold backdrop-blur-xs">
                        <span className="text-xl">+{remainingCount + 1}</span>
                        <span className="text-xs uppercase tracking-wider mt-0.5">more</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom-right "View all photos" button */}
            <button
              onClick={() => openLightbox(0)}
              className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 px-4 py-2 text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md transition-all hover:scale-105"
            >
              <i className="bi bi-grid-3x3-gap-fill text-emerald-600" />
              <span>View all {photoList.length} photos</span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && photoList[activeLightboxIndex] && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black/95 text-white p-4 sm:p-6 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Photo Gallery Lightbox"
        >
          {/* Header controls */}
          <div className="w-full flex items-center justify-between max-w-6xl mx-auto py-2 z-10">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-wider text-slate-300">
                {activeLightboxIndex + 1} / {photoList.length}
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="hidden sm:inline text-sm font-medium text-slate-300 truncate max-w-md">
                {parkName}
              </span>
            </div>

            <button
              onClick={closeLightbox}
              className="rounded-full bg-white/10 hover:bg-white/25 text-white p-2.5 transition focus:outline-none"
              aria-label="Close photo gallery"
            >
              <i className="bi bi-x-lg text-lg" />
            </button>
          </div>

          {/* Main Photo Display */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-auto">
            {hasMultiple && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-2 sm:-left-6 z-20 rounded-full bg-black/60 hover:bg-white/20 text-white p-3 sm:p-4 backdrop-blur transition hover:scale-110 focus:outline-none"
                aria-label="Previous photo"
              >
                <i className="bi bi-chevron-left text-xl sm:text-2xl" />
              </button>
            )}

            <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
              <Image
                src={photoList[activeLightboxIndex].url}
                alt={photoList[activeLightboxIndex].caption || `${parkName} photo ${activeLightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
                unoptimized
                onError={() => handleImageError(photoList[activeLightboxIndex].url)}
              />
            </div>

            {hasMultiple && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 sm:-right-6 z-20 rounded-full bg-black/60 hover:bg-white/20 text-white p-3 sm:p-4 backdrop-blur transition hover:scale-110 focus:outline-none"
                aria-label="Next photo"
              >
                <i className="bi bi-chevron-right text-xl sm:text-2xl" />
              </button>
            )}
          </div>

          {/* Caption & Thumbnail strip footer */}
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-3 pt-2 z-10">
            {photoList[activeLightboxIndex].caption && (
              <p className="text-xs sm:text-sm text-slate-300 text-center max-w-xl">
                {photoList[activeLightboxIndex].caption}
              </p>
            )}

            {/* Thumbnail carousel if multiple */}
            {hasMultiple && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 no-scrollbar">
                {photoList.map((thumb, idx) => (
                  <button
                    key={thumb.url}
                    onClick={() => setActiveLightboxIndex(idx)}
                    className={`relative h-12 w-16 sm:h-14 sm:w-20 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                      idx === activeLightboxIndex
                        ? 'ring-2 ring-emerald-400 scale-105 opacity-100'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                    aria-label={`Jump to photo ${idx + 1}`}
                  >
                    <Image
                      src={thumb.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                      onError={() => handleImageError(thumb.url)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <SubmitPhotoModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        parkName={parkName}
        parkCity={parkCity}
        parkState={parkState}
        listingSlug={listingSlug}
      />
    </>
  );
}
