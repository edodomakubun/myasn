# Migration Instructions: Adding Missing Columns to Certification Table

The error `Could not find the 'back_title' column of 'certification' in the schema cache` indicates that your database is missing the `front_title` and `back_title` columns which were added in the latest update.

Because this environment does not have direct access to run database migrations, you must apply the changes manually using the Supabase Dashboard.

## Steps to Fix

1.  **Open Supabase Dashboard**: Go to your project dashboard at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2.  **Navigate to SQL Editor**: Click on the **SQL Editor** icon in the left sidebar.
3.  **Create a New Query**: Click "New Query".
4.  **Copy and Paste the Migration SQL**: Copy the content of the file `supabase/migrations/20240523_add_titles_to_certification.sql` (also provided below) into the query editor.

    ```sql
    -- Add front_title and back_title columns to certification table
    ALTER TABLE public.certification ADD COLUMN IF NOT EXISTS front_title text;
    ALTER TABLE public.certification ADD COLUMN IF NOT EXISTS back_title text;
    ```

5.  **Run the Query**: Click the **Run** button.
6.  **Refresh Your Application**: Reload your browser page where the application is running. The error should be resolved.
