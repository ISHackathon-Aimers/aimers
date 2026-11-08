ALTER TABLE entries ADD COLUMN kind TEXT NOT NULL DEFAULT 'experience';
--> statement-breakpoint
ALTER TABLE entries ADD COLUMN workflow TEXT NOT NULL DEFAULT '{}';
