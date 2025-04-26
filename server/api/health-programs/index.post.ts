import prisma from "~/lib/prisma";
import { ProgramRegistrationSchema } from "~/shared/types/programs.types";

/**
 * Creates a new health program
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ProgramRegistrationSchema>(event);
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

    // Create a new health program
    await prisma.healthProgram.create({
      data: {
        name,
        description,
      },
    });

    

    return { message: "Health program created successfully" };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create health program",
    });
  }
});
