import prisma from "~/lib/prisma";

/**
 * Retrieve client's details
 */
export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Invalid client id",
      });
    }

    // Check if client exists
    const client = await prisma.client
      .findUniqueOrThrow({
        where: { id },
        include: {
          enrollments: {
            include: {
              healthProgram: true,
              notes: {
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw createError({
          statusCode: 404,
          message: "Client not found",
        });
      });

    const { enrollments, ...flatClient } = client;

    return {
      ...flatClient,
      programs: client.enrollments.map(
        (enrollment) => enrollment.healthProgram
      ),
      notes: client.enrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        programId: enrollment.healthProgramId,
        programName: enrollment.healthProgram.name,
        notes: enrollment.notes,
      })),
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch client",
    });
  }
});
