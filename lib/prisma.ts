import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    // Production: use Turso (libsql)
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken });
    return new PrismaClient({ adapter });
  }

  // Local dev: use file-based SQLite via libsql
  const { PrismaLibSql } = require("@prisma/adapter-libsql");
  const url = process.env.DATABASE_URL || "file:./dev.db";
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
