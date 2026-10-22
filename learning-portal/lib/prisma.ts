// Resilient Prisma client helper that works in dev mode with or without Prisma installed

// In-memory fallback store for development
const memoryStore = {
  progress: new Map<string, { userId: string; topicId: string; status: string; completedAt?: Date | null }>(),
  notes: new Map<string, { userId: string; topicId: string; content: string; updatedAt: Date }>(),
  shared: new Array<{ id: string; userId: string; userName: string; topicId: string; topicTitle: string; content: string; likes: number; createdAt: Date }>(),
};

/* eslint-disable @typescript-eslint/no-explicit-any */
let client: any = null;

declare const __non_webpack_require__: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeRequire = typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__ : eval('require');
  const { PrismaClient } = nodeRequire('@prisma/client');
  const globalForPrisma = global as unknown as { prisma: any };
  client = globalForPrisma.prisma || new PrismaClient({ log: ['error'] });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
} catch {
  // Provide safe in-memory fallback for development
  client = {
    userProgress: {
      upsert: async ({ where, update, create }: any) => {
        const key = `${where.userId_topicId.userId}_${where.userId_topicId.topicId}`;
        const record = { ...create, ...update };
        memoryStore.progress.set(key, record);
        return record;
      },
      findMany: async () => Array.from(memoryStore.progress.values()),
    },
    userNote: {
      upsert: async ({ where, update, create }: any) => {
        const key = `${where.userId_topicId.userId}_${where.userId_topicId.topicId}`;
        const record = { ...create, ...update, updatedAt: new Date() };
        memoryStore.notes.set(key, record);
        return record;
      },
      findMany: async () => Array.from(memoryStore.notes.values()),
    },
    topic: {
      findUnique: async ({ where }: any) => ({ id: where.id }),
    },
  };
}

export const prisma = client;
export { memoryStore };
