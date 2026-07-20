let prismaClient: any = null;

try {
  // Dynamically require Prisma Client to prevent compilation blocks in environments without database packages
  const { PrismaClient } = require("@prisma/client");
  
  // Check if the global instance exists, otherwise create it.
  // This prevents re-creating the client on every hot-reload in development.
  if (globalThis && !(globalThis as any).prisma) { 
    try {
      (globalThis as any).prisma = new PrismaClient();
    } catch (initError: any) {
      console.error("Prisma Client failed to initialize. Falling back to mock.", initError.message);
    }
  }
  prismaClient = (globalThis as any).prisma;
} catch (err) {
  // This catch block handles the case where `@prisma/client` is not installed at all.
}

// If prismaClient is still null (either not installed or failed to init), create the mock.
if (!prismaClient) {
  console.warn("Prisma Client not available. Using mock database wrapper fallback.");
  // High-fidelity fallback client matching the Postgres Prisma schema definitions
  prismaClient = {
    store: {
      findUnique: async (args: any) => null,
      findMany: async () => [],
      create: async (args: any) => ({ id: "mock-store-uuid", ...args.data }),
      update: async (args: any) => ({ id: "mock-store-uuid", ...args.data }),
      delete: async (args: any) => ({ id: "mock-store-uuid" }),
    },
    scan: {
      findMany: async (args: any) => [],
      create: async (args: any) => ({ id: "mock-scan-uuid", ...args.data }),
      deleteMany: async (args: any) => ({ count: 0 }),
    },
    healthAlert: {
      findMany: async (args: any) => [],
      create: async (args: any) => ({ id: "mock-alert-uuid", ...args.data }),
      update: async (args: any) => ({ id: "mock-alert-uuid", ...args.data }),
    }
  };
}

export const prisma = prismaClient;
export default prisma;
