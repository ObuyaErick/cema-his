import prisma from "~/lib/prisma";

/**
 * Retrieve a list of offered health programs
 */
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
