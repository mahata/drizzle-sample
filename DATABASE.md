# Database Setup Guide

This application uses Drizzle ORM with SQLite for persistent message storage.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm package manager

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Generate the initial database schema:
```bash
pnpm run db:generate
```

3. The database will be automatically created and migrated when you first run the application.

## Database Schema

The application uses a simple `messages` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key (auto-incrementing) |
| `message_string` | TEXT | The message content |
| `created_at` | TEXT | Timestamp when message was created (ISO format) |

## Available Commands

### Database Management

- `pnpm run db:generate` - Generate new migration files after schema changes
- `pnpm run db:migrate` - Apply pending migrations to the database
- `pnpm run db:studio` - Open Drizzle Studio for database inspection

### Development

- `pnpm run dev` - Start the development server with watch mode
- `pnpm run build` - Build and type-check the application
- `pnpm run test` - Run tests in watch mode
- `pnpm run test:run` - Run tests once
- `pnpm run lint` - Check code formatting and style
- `pnpm run lint:fix` - Fix automatic formatting issues

## Environment Configuration

The application automatically chooses the appropriate database:

- **Development/Production**: Uses `database.sqlite` file in the project root
- **Testing**: Uses in-memory SQLite database (`:memory:`)

## Database File Location

In development and production, the SQLite database file is created as `database.sqlite` in the project root directory. This file contains all your messages and will persist across application restarts.

⚠️ **Important**: The `database.sqlite` file is excluded from version control via `.gitignore` to prevent accidental commits of local data.

## Schema Evolution

When you need to modify the database schema:

1. Update the schema in `src/db/schema.ts`
2. Generate a new migration: `pnpm run db:generate`
3. The migration will be automatically applied when the application starts

## Production Deployment

### Database Considerations

1. **Backup Strategy**: 
   - SQLite database is a single file (`database.sqlite`)
   - Create regular backups by copying this file
   - Consider using tools like `sqlite3 .backup` for consistent backups

2. **File Permissions**:
   - Ensure the application has read/write permissions to the database file
   - The database file should be writable by the application process

3. **Volume Mounting** (for containers):
   - Mount a persistent volume to store the database file
   - Example Docker volume: `-v /host/data:/app/database.sqlite`

4. **Migration Strategy**:
   - Migrations run automatically on application startup
   - For zero-downtime deployments, consider running migrations separately
   - Test migrations in staging environment first

### Scaling Considerations

SQLite is suitable for:
- ✅ Single-server deployments
- ✅ Low to medium traffic applications
- ✅ Read-heavy workloads
- ✅ Development and testing

Consider migrating to PostgreSQL or MySQL for:
- ❌ Multi-server deployments
- ❌ High-concurrency write operations
- ❌ Applications requiring advanced database features

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**:
   - Check file permissions on the database file and directory
   - Ensure the application process has write access

2. **Database Locked Errors**:
   - Usually indicates another process is accessing the database
   - Check for long-running transactions or other application instances

3. **Migration Failures**:
   - Check the error logs for specific migration issues
   - Ensure the database file is not corrupted
   - Consider restoring from backup if needed

### Debug Information

To inspect the database contents:
```bash
# Using Drizzle Studio (recommended)
pnpm run db:studio

# Using SQLite CLI
sqlite3 database.sqlite ".tables"
sqlite3 database.sqlite "SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;"
```