-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ========================================
-- students（生徒）
-- ========================================
create table public.students (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  name_kana text,
  email text,
  phone text,
  lesson_day text,
  start_date date,
  status text not null default 'active' check (status in ('active', 'inactive', 'graduated')),
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========================================
-- student_charts（生徒カルテ）
-- ========================================
create table public.student_charts (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null unique references public.students(id) on delete cascade,
  handwriting_traits text,
  coaching_policy text,
  strengths text,
  areas_to_improve text,
  goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========================================
-- lessons（レッスン）
-- ========================================
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_date date not null,
  lesson_number integer,
  topic text,
  coach_note text,
  homework text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========================================
-- lesson_photos（レッスン写真）
-- ========================================
create table public.lesson_photos (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  photo_type text not null check (photo_type in ('before', 'after')),
  storage_path text not null,
  display_order integer not null default 0,
  caption text,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========================================
-- Indexes
-- ========================================
create index idx_lessons_student_id on public.lessons(student_id);
create index idx_lessons_lesson_date on public.lessons(lesson_date desc);
create index idx_lesson_photos_lesson_id on public.lesson_photos(lesson_id);

-- ========================================
-- updated_at trigger
-- ========================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger students_updated_at
  before update on public.students
  for each row execute function public.update_updated_at();

create trigger student_charts_updated_at
  before update on public.student_charts
  for each row execute function public.update_updated_at();

create trigger lessons_updated_at
  before update on public.lessons
  for each row execute function public.update_updated_at();

create trigger lesson_photos_updated_at
  before update on public.lesson_photos
  for each row execute function public.update_updated_at();

-- ========================================
-- RLS Policies (MVP: authenticated users can do everything)
-- ========================================
alter table public.students enable row level security;
alter table public.student_charts enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_photos enable row level security;

create policy "Authenticated users full access" on public.students
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.student_charts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.lessons
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.lesson_photos
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ========================================
-- Storage bucket for lesson photos
-- ========================================
insert into storage.buckets (id, name, public)
values ('lesson-photos', 'lesson-photos', true);

create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'lesson-photos' and auth.role() = 'authenticated');

create policy "Authenticated users can update photos"
  on storage.objects for update
  using (bucket_id = 'lesson-photos' and auth.role() = 'authenticated');

create policy "Authenticated users can delete photos"
  on storage.objects for delete
  using (bucket_id = 'lesson-photos' and auth.role() = 'authenticated');

create policy "Anyone can view photos"
  on storage.objects for select
  using (bucket_id = 'lesson-photos');
