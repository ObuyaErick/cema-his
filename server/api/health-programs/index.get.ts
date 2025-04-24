import { PrismaClient } from "~/generated/prisma";

const prisma = new PrismaClient();

export default defineEventHandler(async (_event) => {
  try {
    const healthPrograms = await prisma.healthProgram.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return healthPrograms;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch health programs",
    });
  }
});
