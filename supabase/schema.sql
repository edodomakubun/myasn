-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (User Data)
create table public.profiles (
  id uuid references auth.users not null primary key,
  nip text unique,
  nuptk text,
  name text,
  unit_kerja text,
  phone text,
  address text,
  email text,
  role text default 'guru' check (role in ('admin', 'guru')),
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create app_settings table (Admin Controls)
create table public.app_settings (
  key text primary key,
  is_open boolean default false,
  label text,
  description text
);

-- Seed app_settings
insert into public.app_settings (key, is_open, label, description) values
  ('profile_edit', true, 'Edit Profil', 'Izinkan guru mengedit data kontak (HP, Alamat)'),
  ('education_edit', false, 'Riwayat Pendidikan', 'Izinkan guru mengelola data pendidikan'),
  ('rank_edit', false, 'Riwayat Pangkat/Golongan', 'Izinkan guru mengelola data pangkat'),
  ('salary_edit', false, 'Berkala Gaji', 'Izinkan guru mengelola data gaji berkala'),
  ('certification_edit', false, 'Riwayat Sertifikasi', 'Izinkan guru mengelola data sertifikasi'),
  ('family_edit', false, 'Data Keluarga', 'Izinkan guru mengelola data keluarga'),
  ('appointment_edit', false, 'SK Pengangkatan', 'Izinkan guru mengelola SK Pengangkatan'),
  ('teaching_load_edit', false, 'SK Beban Mengajar', 'Izinkan guru mengelola SK Beban Mengajar'),
  ('photo_edit', false, 'Pas Foto', 'Izinkan guru mengganti pas foto');

-- Enable RLS on app_settings
alter table public.app_settings enable row level security;

-- Policies for app_settings
create policy "Allow public read access to app_settings"
  on public.app_settings for select
  using (true);

create policy "Allow admin to update app_settings"
  on public.app_settings for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));


-- Function to check if a feature is open
create or replace function is_feature_open(feature_key text)
returns boolean as $$
  select is_open from public.app_settings where key = feature_key;
$$ language sql security definer;

-- Function to check if user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;


-- Create education table
create table public.education (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  school_name text not null,
  graduation_year int not null,
  certificate_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.education enable row level security;

-- Create rank_history table
create table public.rank_history (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  golongan text not null,
  pangkat text not null,
  masa_kerja_thn int,
  masa_kerja_bln int,
  tmt_golongan date,
  sk_number text,
  sk_date date,
  sk_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.rank_history enable row level security;

-- Create salary_history table
create table public.salary_history (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  sk_number text,
  sk_date date,
  tmt_berkala date,
  sk_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.salary_history enable row level security;

-- Create certification table
create table public.certification (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  cert_number text,
  cert_date date,
  valid_until date,
  front_title text,
  back_title text,
  institution text,
  cert_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.certification enable row level security;

-- Create family table (Structured data mostly just URLs)
create table public.family (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  kk_url text,
  birth_cert_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.family enable row level security;

-- Create appointment table (SK Pengangkatan)
create table public.appointment (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  sk_number text,
  sk_date date,
  sk_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointment enable row level security;

-- Create teaching_load table (SK Beban Mengajar)
create table public.teaching_load (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  sk_number text,
  sk_date date,
  sk_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.teaching_load enable row level security;


-- RLS Policies for Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true); -- Or limit to authenticated users

create policy "Users can update own profile contact info if allowed"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and (is_feature_open('profile_edit') or is_admin()));

-- RLS Helper for Data Tables
-- Users can View their own data.
-- Users can Insert/Update/Delete their own data ONLY IF the feature is OPEN or they are Admin.

-- Education Policies
create policy "Users can view own education"
  on public.education for select
  using (auth.uid() = profile_id);

create policy "Users can insert own education if open"
  on public.education for insert
  with check (auth.uid() = profile_id and (is_feature_open('education_edit') or is_admin()));

create policy "Users can update own education if open"
  on public.education for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id and (is_feature_open('education_edit') or is_admin()));

create policy "Users can delete own education if open"
  on public.education for delete
  using (auth.uid() = profile_id and (is_feature_open('education_edit') or is_admin()));


-- Rank History Policies
create policy "Users can view own rank_history"
  on public.rank_history for select
  using (auth.uid() = profile_id);

create policy "Users can insert own rank_history if open"
  on public.rank_history for insert
  with check (auth.uid() = profile_id and (is_feature_open('rank_edit') or is_admin()));

create policy "Users can update own rank_history if open"
  on public.rank_history for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id and (is_feature_open('rank_edit') or is_admin()));

create policy "Users can delete own rank_history if open"
  on public.rank_history for delete
  using (auth.uid() = profile_id and (is_feature_open('rank_edit') or is_admin()));


-- Salary History Policies
create policy "Users can view own salary_history"
  on public.salary_history for select
  using (auth.uid() = profile_id);

create policy "Users can insert own salary_history if open"
  on public.salary_history for insert
  with check (auth.uid() = profile_id and (is_feature_open('salary_edit') or is_admin()));

create policy "Users can update own salary_history if open"
  on public.salary_history for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id and (is_feature_open('salary_edit') or is_admin()));

create policy "Users can delete own salary_history if open"
  on public.salary_history for delete
  using (auth.uid() = profile_id and (is_feature_open('salary_edit') or is_admin()));


-- Certification Policies
create policy "Users can view own certification"
  on public.certification for select
  using (auth.uid() = profile_id);

create policy "Users can insert own certification if open"
  on public.certification for insert
  with check (auth.uid() = profile_id and (is_feature_open('certification_edit') or is_admin()));

create policy "Users can update own certification if open"
  on public.certification for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id and (is_feature_open('certification_edit') or is_admin()));

create policy "Users can delete own certification if open"
  on public.certification for delete
  using (auth.uid() = profile_id and (is_feature_open('certification_edit') or is_admin()));


-- Family Policies
create policy "Users can view own family"
  on public.family for select
  using (auth.uid() = profile_id);

create policy "Users can insert own family if open"
  on public.family for insert
  with check (auth.uid() = profile_id and (is_feature_open('family_edit') or is_admin()));

create policy "Users can update own family if open"
  on public.family for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id and (is_feature_open('family_edit') or is_admin()));

create policy "Users can delete own family if open"
  on public.family for delete
  using (auth.uid() = profile_id and (is_feature_open('family_edit') or is_admin()));


-- Appointment Policies
create policy "Users can view own appointment"
  on public.appointment for select
  using (auth.uid() = profile_id);

create policy "Users can insert own appointment if open"
  on public.appointment for insert
  with check (auth.uid() = profile_id and (is_feature_open('appointment_edit') or is_admin()));

create policy "Users can update own appointment if open"
  on public.appointment for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id and (is_feature_open('appointment_edit') or is_admin()));

create policy "Users can delete own appointment if open"
  on public.appointment for delete
  using (auth.uid() = profile_id and (is_feature_open('appointment_edit') or is_admin()));


-- Teaching Load Policies
create policy "Users can view own teaching_load"
  on public.teaching_load for select
  using (auth.uid() = profile_id);

create policy "Users can insert own teaching_load if open"
  on public.teaching_load for insert
  with check (auth.uid() = profile_id and (is_feature_open('teaching_load_edit') or is_admin()));

create policy "Users can update own teaching_load if open"
  on public.teaching_load for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id and (is_feature_open('teaching_load_edit') or is_admin()));

create policy "Users can delete own teaching_load if open"
  on public.teaching_load for delete
  using (auth.uid() = profile_id and (is_feature_open('teaching_load_edit') or is_admin()));


-- Storage Buckets (These usually need to be created in the Supabase Dashboard, but policies can be SQL)
-- Create a bucket 'documents'
insert into storage.buckets (id, name, public) values ('documents', 'documents', true);

-- Policy to allow authenticated uploads to 'documents'
create policy "Allow authenticated uploads"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.role() = 'authenticated');

-- Policy to allow public read of 'documents'
create policy "Allow public read"
  on storage.objects for select
  using (bucket_id = 'documents');

-- Policy to allow users to update their own files (optional, but good)
create policy "Allow users to update own files"
  on storage.objects for update
  with check (bucket_id = 'documents' and auth.uid() = owner);

-- Policy to allow users to delete their own files
create policy "Allow users to delete own files"
  on storage.objects for delete
  using (bucket_id = 'documents' and auth.uid() = owner);

-- Create permitted_users table (Whitelist)
create table public.permitted_users (
  email text primary key,
  nip text not null,
  name text not null,
  unit_kerja text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on permitted_users
alter table public.permitted_users enable row level security;

create policy "Allow admin to manage permitted_users"
  on public.permitted_users for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Trigger to create profile on signup if email is permitted
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_data public.permitted_users%ROWTYPE;
begin
  select * into user_data from public.permitted_users where email = new.email;

  if found then
    insert into public.profiles (id, email, nip, name, unit_kerja, role)
    values (new.id, new.email, user_data.nip, user_data.name, user_data.unit_kerja, 'guru');
    return new;
  else
    return new;
  end if;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
