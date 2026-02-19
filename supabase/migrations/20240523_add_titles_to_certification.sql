-- Add front_title and back_title columns to certification table
ALTER TABLE public.certification ADD COLUMN IF NOT EXISTS front_title text;
ALTER TABLE public.certification ADD COLUMN IF NOT EXISTS back_title text;
