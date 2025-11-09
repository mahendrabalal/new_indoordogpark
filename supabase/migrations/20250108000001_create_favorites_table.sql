-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    park_id text NOT NULL,
    park_slug text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create unique constraint to prevent duplicate favorites
ALTER TABLE public.favorites ADD CONSTRAINT favorites_user_park_unique
    UNIQUE (user_id, park_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_park_id ON public.favorites(park_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own favorites
CREATE POLICY "Users can read their own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own favorites
CREATE POLICY "Users can insert their own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);