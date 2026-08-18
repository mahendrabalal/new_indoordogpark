'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface SubmitPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkName: string;
  parkCity?: string;
  parkState?: string;
  listingSlug?: string;
}

interface SelectedFile {
  file: File;
  previewUrl: string;
  caption?: string;
}

export default function SubmitPhotoModal({
  isOpen,
  onClose,
  parkName,
  parkCity,
  parkState,
  listingSlug,
}: SubmitPhotoModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderEmail, setUploaderEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage('');
    const newFiles: SelectedFile[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 5MB file limit.`);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setErrorMessage(`"${file.name}" is not a supported image format.`);
        return;
      }

      newFiles.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    });

    setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select at least one photo to upload.');
      return;
    }
    if (!uploaderName.trim() || !uploaderEmail.trim()) {
      setErrorMessage('Please enter your name and email address.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      const uploadedUrls: string[] = [];

      // 1. Upload files to upload endpoint
      for (const item of selectedFiles) {
        const formData = new FormData();
        formData.append('file', item.file);

        const uploadRes = await fetch('/api/uploads/park-photos', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const data = await uploadRes.json();
          if (data?.photo?.url) {
            uploadedUrls.push(data.photo.url);
          }
        }
      }

      // 2. Notify Admin via Contact API
      const locationText = [parkCity, parkState].filter(Boolean).join(', ');
      const messageBody = `
New Community Photos Submitted for Dog Park:
--------------------------------------------
Park Name: ${parkName}
Location: ${locationText || 'N/A'}
Listing Slug: ${listingSlug || 'N/A'}

Submitted By: ${uploaderName} (${uploaderEmail})
Notes / Captions: ${notes || 'None provided'}

Uploaded Photo URLs:
${uploadedUrls.length > 0 ? uploadedUrls.map((url, idx) => `${idx + 1}. ${url}`).join('\n') : 'Files uploaded directly'}
      `.trim();

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uploaderName,
          email: uploaderEmail,
          category: 'general',
          subject: `📸 New Photos Submitted: ${parkName}`,
          message: messageBody,
        }),
      });

      // 3. Optional Newsletter Opt-In Sync to Beehiiv
      if (subscribeNewsletter && uploaderEmail.trim()) {
        try {
          await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: uploaderEmail.trim(),
              name: uploaderName.trim(),
              type: 'photo_contributor',
              source: 'photo_submission_modal',
              parkName: parkName,
              city: parkCity,
              state: parkState,
            }),
          });
        } catch (subErr) {
          console.warn('[SubmitPhotoModal] Newsletter sync notice:', subErr);
        }
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Error uploading photos:', err);
      setErrorMessage('Failed to submit photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setSelectedFiles([]);
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
              <i className="bi bi-camera-fill" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Submit Photos
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[280px] sm:max-w-xs">
                {parkName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors text-sm"
            aria-label="Close modal"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                <i className="bi bi-check2-circle" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Photos Submitted Successfully!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
                Thank you for contributing to the community! Our team will review and publish your photos to{' '}
                <strong>{parkName}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill text-base flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Photo Upload Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Photos (Up to 5 images, Max 5MB each)
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                    <i className="bi bi-cloud-arrow-up-fill" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    Click to browse or drop photos here
                  </p>
                  <p className="text-[11px] text-slate-500">
                    JPG, PNG, WEBP supported
                  </p>
                </div>

                {/* Thumbnail Previews */}
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-3">
                    {selectedFiles.map((item, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                        <Image
                          src={item.previewUrl}
                          alt={`Upload preview ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center text-xs transition-colors shadow"
                        >
                          <i className="bi bi-trash3-fill" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Uploader Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={uploaderEmail}
                    onChange={(e) => setUploaderEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Caption / Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo Caption or Location Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Main indoor artificial turf area and agility obstacles"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Newsletter Opt-in Checkbox */}
              <div className="flex items-start gap-3 p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <input
                  type="checkbox"
                  id="subscribeNewsletter"
                  checked={subscribeNewsletter}
                  onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
                />
                <label
                  htmlFor="subscribeNewsletter"
                  className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none"
                >
                  <span className="font-semibold text-slate-900">
                    Get Free Indoor Dog Park Updates
                  </span>{' '}
                  — Monthly newsletter featuring new park openings, city guides, and exclusive gear deals.{' '}
                  <span className="text-[11px] text-slate-500">(Unsubscribe anytime)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || selectedFiles.length === 0}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up-fill" />
                      <span>Upload & Submit</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
