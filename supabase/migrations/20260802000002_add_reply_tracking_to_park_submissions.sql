-- =============================================
-- Add reply tracking columns to park_submissions
-- Run this in your Supabase SQL Editor
-- =============================================

ALTER TABLE park_submissions
ADD COLUMN IF NOT EXISTS reply_message TEXT,
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
