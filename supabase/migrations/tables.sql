/*
# MentorFi — single-tenant persistence tables (no auth)

1. New Tables
- `goals`: user-created financial goals (name, target, saved, monthly saving, icon, color).
- `chat_messages`: AI mentor conversation messages (session_id, role, text).
- `budget_plans`: saved budget planner inputs + computed result (jsonb).
- `emi_analyses`: saved EMI detector inputs + computed result (jsonb).

2. Security
- App is a single-tenant app with no sign-in screen. RLS enabled on every table.
- Policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because the data is intentionally shared/public across the single anon-key client.
- No user_id columns, no auth.uid() checks.

3. Notes
- All tables use gen_random_uuid() primary keys and created_at defaults.
- jsonb columns store computed planner/EMI results so the UI can reload snapshots.
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  target_amount integer NOT NULL DEFAULT 0,
  saved_amount integer NOT NULL DEFAULT 0,
  monthly_saving integer NOT NULL DEFAULT 0,
  icon text NOT NULL DEFAULT '🎯',
  color text NOT NULL DEFAULT 'from-sky-500 to-blue-600',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_goals" ON goals;
CREATE POLICY "anon_select_goals" ON goals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_goals" ON goals;
CREATE POLICY "anon_insert_goals" ON goals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_goals" ON goals;
CREATE POLICY "anon_update_goals" ON goals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_goals" ON goals;
CREATE POLICY "anon_delete_goals" ON goals FOR DELETE
  TO anon, authenticated USING (true);


CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_session_created_idx
  ON chat_messages (session_id, created_at);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chat_messages" ON chat_messages;
CREATE POLICY "anon_select_chat_messages" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_messages" ON chat_messages;
CREATE POLICY "anon_insert_chat_messages" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_messages" ON chat_messages;
CREATE POLICY "anon_delete_chat_messages" ON chat_messages FOR DELETE
  TO anon, authenticated USING (true);


CREATE TABLE IF NOT EXISTS budget_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salary integer NOT NULL DEFAULT 0,
  city text NOT NULL DEFAULT '',
  rent integer NOT NULL DEFAULT 0,
  travel integer NOT NULL DEFAULT 0,
  remittance integer NOT NULL DEFAULT 0,
  has_loans boolean NOT NULL DEFAULT false,
  loan_emi integer NOT NULL DEFAULT 0,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE budget_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_budget_plans" ON budget_plans;
CREATE POLICY "anon_select_budget_plans" ON budget_plans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_budget_plans" ON budget_plans;
CREATE POLICY "anon_insert_budget_plans" ON budget_plans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_budget_plans" ON budget_plans;
CREATE POLICY "anon_delete_budget_plans" ON budget_plans FOR DELETE
  TO anon, authenticated USING (true);


CREATE TABLE IF NOT EXISTS emi_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_cost integer NOT NULL DEFAULT 0,
  down_payment integer NOT NULL DEFAULT 0,
  monthly_emi integer NOT NULL DEFAULT 0,
  months integer NOT NULL DEFAULT 0,
  processing_fee integer NOT NULL DEFAULT 0,
  salary integer NOT NULL DEFAULT 0,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE emi_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_emi_analyses" ON emi_analyses;
CREATE POLICY "anon_select_emi_analyses" ON emi_analyses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_emi_analyses" ON emi_analyses;
CREATE POLICY "anon_insert_emi_analyses" ON emi_analyses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_emi_analyses" ON emi_analyses;
CREATE POLICY "anon_delete_emi_analyses" ON emi_analyses FOR DELETE
  TO anon, authenticated USING (true);
