CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '에이머', cadence INTEGER NOT NULL DEFAULT 7, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, color TEXT NOT NULL, UNIQUE(user_id,name));
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS entries (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, category TEXT NOT NULL, date TEXT NOT NULL, original TEXT NOT NULL, summary TEXT NOT NULL, tags TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS entries_user ON entries(user_id,date);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, period INTEGER NOT NULL, token TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS members (group_id TEXT NOT NULL, user_id TEXT NOT NULL, joined_at TEXT NOT NULL, PRIMARY KEY(group_id,user_id));
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, actor_id TEXT NOT NULL, group_id TEXT, body TEXT NOT NULL, is_read INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS notifications_user ON notifications(user_id,created_at);