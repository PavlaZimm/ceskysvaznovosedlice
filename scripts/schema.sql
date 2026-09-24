CREATE TABLE IF NOT EXISTS csz_content (
  key text PRIMARY KEY CHECK (key IN ('obsah/stranky.json', 'obsah/galerie.json')),
  data jsonb NOT NULL,
  revision integer NOT NULL DEFAULT 1,
  message text NOT NULL DEFAULT 'Počáteční obsah',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS csz_content_history (
  key text NOT NULL,
  revision integer NOT NULL,
  data jsonb NOT NULL,
  message text NOT NULL,
  saved_at timestamptz NOT NULL,
  PRIMARY KEY (key, revision)
);
CREATE OR REPLACE FUNCTION csz_archive_content() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO csz_content_history(key, revision, data, message, saved_at)
  VALUES (OLD.key, OLD.revision, OLD.data, OLD.message, OLD.updated_at)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER csz_content_history_trigger BEFORE UPDATE ON csz_content
FOR EACH ROW EXECUTE FUNCTION csz_archive_content();

CREATE TABLE IF NOT EXISTS csz_login_attempts (
  key text PRIMARY KEY,
  attempts integer NOT NULL,
  expires_at timestamptz NOT NULL
);
