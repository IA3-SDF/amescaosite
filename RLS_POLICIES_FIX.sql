-- ============================================================================
-- 🔐 FIX RLS POLICIES - Permet lecture à tous authentifiés, écriture admin seulement
-- ============================================================================

-- ============================================================================
-- 1️⃣ ENABLE RLS sur toutes les tables
-- ============================================================================
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bureau ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reports ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2️⃣ SUPPRIMER les anciennes policies (si elles existent)
-- ============================================================================

-- Profiles
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
DROP POLICY IF EXISTS "profiles_select_authenticated" ON profiles;
DROP POLICY IF EXISTS "profiles_select_admin_only" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;

-- Bureau
DROP POLICY IF EXISTS "bureau_select_public" ON bureau;
DROP POLICY IF EXISTS "bureau_select_authenticated" ON bureau;
DROP POLICY IF EXISTS "bureau_select_admin_only" ON bureau;
DROP POLICY IF EXISTS "bureau_insert_admin" ON bureau;
DROP POLICY IF EXISTS "bureau_update_admin" ON bureau;
DROP POLICY IF EXISTS "bureau_delete_admin" ON bureau;

-- Events
DROP POLICY IF EXISTS "events_select_public" ON events;
DROP POLICY IF EXISTS "events_select_authenticated" ON events;
DROP POLICY IF EXISTS "events_select_admin_only" ON events;
DROP POLICY IF EXISTS "events_insert_admin" ON events;
DROP POLICY IF EXISTS "events_update_admin" ON events;
DROP POLICY IF EXISTS "events_delete_admin" ON events;

-- Albums
DROP POLICY IF EXISTS "albums_select_public" ON albums;
DROP POLICY IF EXISTS "albums_select_authenticated" ON albums;
DROP POLICY IF EXISTS "albums_select_admin_only" ON albums;
DROP POLICY IF EXISTS "albums_insert_admin" ON albums;
DROP POLICY IF EXISTS "albums_update_admin" ON albums;
DROP POLICY IF EXISTS "albums_delete_admin" ON albums;

-- Reports
DROP POLICY IF EXISTS "reports_select_public" ON reports;
DROP POLICY IF EXISTS "reports_select_authenticated" ON reports;
DROP POLICY IF EXISTS "reports_select_admin_only" ON reports;
DROP POLICY IF EXISTS "reports_insert_admin" ON reports;
DROP POLICY IF EXISTS "reports_update_admin" ON reports;
DROP POLICY IF EXISTS "reports_delete_admin" ON reports;

-- ============================================================================
-- 3️⃣ CRÉER les nouvelles POLICIES DE LECTURE (SELECT) - Accessible à TOUS authentifiés
-- ============================================================================

-- PROFILES : Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "profiles_select_authenticated" ON profiles
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- BUREAU : Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "bureau_select_authenticated" ON bureau
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- EVENTS : Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "events_select_authenticated" ON events
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- ALBUMS : Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "albums_select_authenticated" ON albums
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- REPORTS : Lecture pour tous les utilisateurs authentifiés
CREATE POLICY "reports_select_authenticated" ON reports
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 4️⃣ CRÉER les POLICIES D'ÉCRITURE (INSERT/UPDATE/DELETE) - Admins uniquement
-- ============================================================================

-- PROFILES: Écriture admin seulement
CREATE POLICY "profiles_insert_admin" ON profiles
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- BUREAU: Écriture admin seulement
CREATE POLICY "bureau_insert_admin" ON bureau
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "bureau_update_admin" ON bureau
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "bureau_delete_admin" ON bureau
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- EVENTS: Écriture admin seulement
CREATE POLICY "events_insert_admin" ON events
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "events_update_admin" ON events
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "events_delete_admin" ON events
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ALBUMS: Écriture admin seulement
CREATE POLICY "albums_insert_admin" ON albums
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "albums_update_admin" ON albums
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "albums_delete_admin" ON albums
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- REPORTS: Écriture admin seulement
CREATE POLICY "reports_insert_admin" ON reports
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "reports_update_admin" ON reports
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "reports_delete_admin" ON reports
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 5️⃣ CONFIGURER LES POLICIES POUR LE BUCKET STORAGE "amescao"
-- ============================================================================

-- DROP les anciennes policies du bucket
DROP POLICY IF EXISTS "Allow upload to amescao bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow download from amescao bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete from amescao bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to download" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin users to delete" ON storage.objects;

-- CRÉER les policies pour le bucket amescao
-- 1. SELECT: Lecture publique pour tous
CREATE POLICY "amescao_select_public" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'amescao');

-- 2. INSERT: Upload autorisé pour tous les utilisateurs authentifiés
CREATE POLICY "amescao_insert_authenticated" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'amescao' 
    AND auth.role() = 'authenticated'
  );

-- 3. UPDATE: Update autorisé pour tous les utilisateurs authentifiés (peut être nécessaire pour certains cas)
CREATE POLICY "amescao_update_authenticated" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'amescao' 
    AND auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'amescao' 
    AND auth.role() = 'authenticated'
  );

-- 4. DELETE: Suppression autorisée pour les admins seulement
CREATE POLICY "amescao_delete_admin" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'amescao' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 6️⃣ VÉRIFICATION
-- ============================================================================

-- Vérifier les RLS policies sur les tables
SELECT 
  t.tablename,
  p.policyname,
  p.permissive,
  p.roles,
  p.qual,
  p.with_check
FROM 
  pg_policies p
  JOIN pg_tables t ON p.tablename = t.tablename
WHERE 
  t.schemaname = 'public' 
  AND t.tablename IN ('profiles', 'bureau', 'events', 'albums', 'reports')
ORDER BY 
  t.tablename, p.policyname;

-- Vérifier les RLS policies sur le storage
SELECT 
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM 
  pg_policies
WHERE 
  tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY 
  policyname;
