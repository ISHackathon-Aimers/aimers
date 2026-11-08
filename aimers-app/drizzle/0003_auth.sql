CREATE TABLE IF NOT EXISTS auth_accounts (provider TEXT NOT NULL, subject TEXT NOT NULL, user_id TEXT NOT NULL UNIQUE, email TEXT NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY(provider,subject));
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS auth_sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS auth_sessions_user ON auth_sessions(user_id);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS oauth_states (state_hash TEXT PRIMARY KEY, nonce TEXT NOT NULL, verifier TEXT NOT NULL, return_to TEXT NOT NULL, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS ai_requests (user_id TEXT NOT NULL, requested_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS ai_requests_user_time ON ai_requests(user_id,requested_at);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS interview_practice (user_id TEXT NOT NULL, entry_id TEXT NOT NULL, payload TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(user_id,entry_id));
