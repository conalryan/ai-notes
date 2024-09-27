# OpenAI NextJS

## [NextJS](https://nextjs.org/docs)

```bash
pnpm dlx create-next-app@latest
```

## [Clerk](https://clerk.com/docs)

```bash
pnpm --filter openai-nextjs add @clerk/nextjs
```

## [Neon DB](https://neon.tech/docs/get-started-with-neon/signing-up)

### Playing with Neon

```sql
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
```

### Create a new branch

```bash
neon branches create --name dev/conal
```

### Connect to your database

Get the connection string to your branch and connect to it directly via psql:

```bash
neon connection-string dev/conal --database-name mydb --psql
```

This command establishes the psql terminal connection to the neondb database on your dev branch.

### Modify the schema

Add a new column description and index it:

```sql
ALTER TABLE playing_with_neon
ADD COLUMN description TEXT;

CREATE INDEX idx_playing_with_neon_description ON playing_with_neon (description);
```

### Insert new data

Add new data that will be exclusive to the dev branch.

```sql
INSERT INTO playing_with_neon (name, description)
VALUES ('Your dev branch', 'Exploring schema changes in the dev branch');
```

### Verify the schema changes

Query the table to verify your schema changes:

```sql
SELECT * FROM playing_with_neon;
```

### Reset your branch

```bash
neon branches reset dev/conal --parent
```

A Neon connection string includes the role, password, hostname, and database name.

postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname

.env file

```
PGUSER=alex
PGHOST=ep-cool-darkness-123456.us-east-2.aws.neon.tech
PGDATABASE=dbname
PGPASSWORD=AbC123dEf
PGPORT=5432
```

Variable

```
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname"
```

Command-line

```bash
psql postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
```

## [Prisma](https://www.prisma.io/docs/getting-started/quickstart)

### Install

```bash
pnpm add prisma --save-dev
```

### Setup

```bash
pnpm --filter openai-nextjs exec prisma init
```

This creates a new prisma directory with a schema.prisma file and configures SQLite as your database. You're now ready to model your data and create your database with some tables.

### Update the schema

```bash
pnpm --filter openai-nextjs exec prisma db push
```
