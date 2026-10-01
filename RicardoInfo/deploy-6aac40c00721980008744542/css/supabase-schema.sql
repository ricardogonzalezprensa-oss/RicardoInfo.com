-- =========================================================
-- ricardoinfo.com — esquema de base de datos para Supabase
-- Ejecutar completo en: Supabase → SQL Editor → New query → Run
-- =========================================================

-- 1) PERFILES (guarda el rol de cada usuario: 'user' o 'developer')
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'developer'))
);

alter table public.profiles enable row level security;

create policy "cada quien lee su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- Crea el perfil automáticamente cuando se crea un usuario en Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2) SECCIONES
create table public.sections (
  id text primary key,
  title text not null,
  description text not null default '',
  color text not null default '#D92640'
);

alter table public.sections enable row level security;

create policy "cualquiera puede leer las secciones"
  on public.sections for select
  using (true);

create policy "solo developers editan secciones"
  on public.sections for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'developer'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'developer'));


-- 3) NOTICIAS
create table public.news (
  id text primary key,
  section text not null references public.sections(id),
  title text not null,
  category text not null,
  author text,
  time text,
  image text,
  content text,
  created_at timestamptz not null default now()
);

alter table public.news enable row level security;

create policy "cualquiera puede leer noticias"
  on public.news for select
  using (true);

create policy "solo developers editan noticias"
  on public.news for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'developer'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'developer'));


-- 4) DATOS INICIALES (las 4 secciones y las 7 noticias que ya tenías)

insert into public.sections (id, title, description, color) values
('analisis', 'Política y geopolítica', 'Las noticias más importantes de política internacional y las tensiones que redefinen el mapa global.', '#D92640'),
('opinion',  'Análisis y opinión',      'Miradas y columnas de opinión sobre los hechos que marcan la agenda política y social.', '#6C5AB3'),
('bono',     'Bono y banca',            'Mercados de deuda, bancos centrales y todo lo que mueve al sistema financiero.', '#2380B5'),
('cultura',  'Cultura y economía',      'El cruce entre la economía global y los fenómenos culturales que la acompañan.', '#2D8C72');

insert into public.news (id, section, title, category, author, time, image, content) values
('main-story', 'analisis', 'Análisis: cómo evoluciona el equilibrio de poder entre las grandes potencias', 'Exclusiva', 'Redacción ricardoinfo.com', 'Hace 12 min',
 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1400&auto=format&fit=crop',
 E'El tablero geopolítico global se mueve más rápido que en las últimas décadas, con nuevas alianzas comerciales y militares tomando forma en distintas regiones.\n\nEn este análisis repasamos las tendencias que marcarán la agenda internacional en los próximos meses y qué significan para los mercados y la ciudadanía.'),

('side-story-1', 'bono', 'Guía rápida: cómo leer los indicadores económicos clave del mes', 'Bono y banca', null, null,
 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
 E'Inflación, tasas de interés y tipo de cambio son los datos que más se repiten en la conversación económica, pero no siempre queda claro cómo interpretarlos en conjunto.\n\nEsta guía rápida explica, en términos simples, qué mide cada indicador y por qué le importa a cualquier persona, no solo a los inversores.'),

('side-story-2', 'analisis', 'Rumores apuntan a una nueva ronda de negociaciones diplomáticas', 'Política y geopolítica', null, null,
 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800&auto=format&fit=crop',
 E'Distintas fuentes diplomáticas señalan que podría convocarse una nueva ronda de conversaciones entre los bloques regionales en las próximas semanas.\n\nAunque ningún gobierno lo ha confirmado oficialmente, el tema ya domina la agenda de varios encuentros multilaterales previstos para este trimestre.'),

('news-1', 'bono', 'Bancos centrales evalúan ajustes en la política monetaria', 'Bono y banca', null, null,
 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=800&auto=format&fit=crop',
 E'Varios bancos centrales analizan modificar sus tasas de referencia ante el comportamiento reciente de la inflación y el consumo.\n\nLos analistas esperan mayor claridad en las próximas reuniones de política monetaria, que podrían marcar el rumbo de los mercados durante el resto del año.'),

('news-2', 'opinion', 'Opinión: los retos de la gobernabilidad en un mundo multipolar', 'Análisis y opinión', null, null,
 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
 E'La fragmentación del poder global obliga a los gobiernos a repensar sus estrategias de alianzas y negociación.\n\nEn esta columna se examinan los principales desafíos que enfrentan los líderes actuales para sostener consensos internos mientras navegan un escenario internacional cada vez más impredecible.'),

('news-3', 'cultura', 'Claves para entender el impacto cultural de la nueva integración regional', 'Cultura y economía', null, null,
 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=800&auto=format&fit=crop',
 E'Los acuerdos de integración regional no solo mueven aranceles y aduanas: también cambian el consumo cultural de millones de personas.\n\nRepasamos cómo la circulación de bienes y servicios está transformando la producción artística y mediática de la región.'),

('news-4', 'analisis', 'Cumbre internacional confirma fecha para el próximo encuentro', 'Política y geopolítica', null, null,
 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
 E'La organización de la cumbre confirmó la fecha y sede del próximo encuentro internacional, que reunirá a delegaciones de distintos países.\n\nSe espera una amplia cobertura mediática, tanto de la agenda oficial como de los encuentros bilaterales paralelos.');
