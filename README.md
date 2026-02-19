# Guru Data Rejuvenation App (MYASN BKN Clone)

This is a Single Page Application (SPA) built with React + Vite + Bootstrap and Supabase for teachers to update their data (Peremajaan Data).

## Features

-   **Authentication**: Google Login via Supabase (whitelist restricted).
-   **Modules**:
    -   Profile (Admin managed)
    -   Education (Riwayat Pendidikan)
    -   Rank History (Riwayat Pangkat/Golongan)
    -   Salary History (Berkala Gaji)
    -   Certification (Riwayat Sertifikasi)
    -   Family Data (Data Keluarga)
    -   Documents (SK Pengangkatan, SK Beban Mengajar)
-   **Admin Controls**: Enable/Disable editing for specific modules.
-   **File Upload**: Supports PDF/JPG (max 2MB).

## Setup & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Ensure `.env` contains your Supabase URL and Anon Key.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Database Schema & Migrations

The database schema is defined in `supabase/schema.sql`.

### Troubleshooting: Missing Columns

If you encounter errors like `Could not find the 'back_title' column`, please refer to `MIGRATION_INSTRUCTIONS.md` to manually update your database schema using the Supabase Dashboard.
