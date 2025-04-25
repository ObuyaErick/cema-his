import prisma from "~/lib/prisma";

/**
 * Enroll a client into a program
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { clientId, healthProgramId } = body;

    // Check if client exists
    await prisma.client
      .findUniqueOrThrow({
        where: { id: clientId },
      })
      .catch(() => {
        throw createError({
          statusCode: 404,
          message: "Client not found",
        });
      });

    // Check if health program exists
    await prisma.healthProgram
      .findUnique({
        where: { id: healthProgramId },
      })
      .catch(() => {
        throw createError({
          statusCode: 404,
          message: "Health program not found",
        });
      });

    // Check possible enrollment conflict
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        clientId,
        healthProgramId,
      },
    });

    if (existingEnrollment) {
      throw createError({
        statusCode: 400,
        message: "Client is already enrolled in this program",
      });
    }

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        clientId,
        healthProgramId,
      },
      include: {
        client: true,
        healthProgram: true,
      },
    });

    return {
      message: "Successfully enrolled client to this program",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to enroll client",
    });
  }
});
