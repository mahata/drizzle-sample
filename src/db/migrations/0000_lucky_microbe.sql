CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`message_string` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
