ALTER TABLE users ADD COLUMN start_date TEXT;
--> statement-breakpoint
ALTER TABLE users ADD COLUMN visibility TEXT NOT NULL DEFAULT 'private';
--> statement-breakpoint
ALTER TABLE users ADD COLUMN avatar TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE users ADD COLUMN font TEXT NOT NULL DEFAULT 'sans';
--> statement-breakpoint
ALTER TABLE users ADD COLUMN font_size INTEGER NOT NULL DEFAULT 16;
--> statement-breakpoint
ALTER TABLE entries ADD COLUMN visibility TEXT NOT NULL DEFAULT 'inherit';
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS members_user ON members(user_id,group_id);
