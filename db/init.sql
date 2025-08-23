-- -------------------------- ENUM & 汎用オブジェクト --------------------------

-- ENUM 定義
CREATE TYPE theme_color_enum AS ENUM ('system', 'light', 'dark');
CREATE TYPE organization_role_enum AS ENUM ('owner', 'member', 'guest');

-- 共通トリガ関数（updated_at 自動更新）
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END; $$;

-- UUID v7 生成関数 (https://gist.github.com/kjmph/5bd772b2c2df145aa645b837da7eca74?permalink_comment_id=4747384#gistcomment-4747384)
create or replace function uuid_generate_v7()
returns uuid
as $$
  -- use random v4 uuid as starting point (which has the same variant we need)
  -- then overlay timestamp
  -- then set version 7 by flipping the 2 and 1 bit in the version 4 string
select encode(
    set_bit(
      set_bit(
        overlay(uuid_send(gen_random_uuid())
                placing substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3)
                from 1 for 6
        ),
        52, 1
      ),
      53, 1
    ),
    'hex')::uuid;
$$
language SQL
volatile;

-- -------------------------- スキーマ定義 --------------------------

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  firebase_uid text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
  );
CREATE INDEX ON users (firebase_uid);

CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  theme_color theme_color_enum NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role organization_role_enum NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE organization_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  theme_color theme_color_enum NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE prompts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE prompt_favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE prompt_tags(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE prompt_assets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE assets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- トリガ適用
DO $$
DECLARE
  _tbl text;
BEGIN
  FOR _tbl IN
    SELECT t.table_name
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND EXISTS (
        SELECT 1 FROM information_schema.columns c
        WHERE c.table_schema = 'public'
          AND c.table_name = t.table_name
          AND c.column_name = 'updated_at')
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_set_updated_at_%I
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
      _tbl, _tbl
    );
  END LOOP;
END $$ LANGUAGE plpgsql;
