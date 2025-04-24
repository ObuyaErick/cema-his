import { PrismaClient } from "~/generated/prisma";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, description } = body;

    // Check if program exists
    const existingProgram = await prisma.healthProgram.findUnique({
      where: { name },
    });

    if (existingProgram) {
      throw createError({
        statusCode: 409,
        message: "Health program already exists",
      });
    }

    // A new health program
    const healthProgram = await prisma.healthProgram.create({
      data: {
        name,
        description,
      },
    });

    return healthProgram;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create health program",
    });
  }
});
