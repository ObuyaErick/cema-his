import prisma from "~/lib/prisma";

/**
 * Obtains a list of programs the client is enrolled in
 */
export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id) ?? -1;
    if (id < 0) {
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

    return client.enrollments.map((enrollment) => enrollment.healthProgram);
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch client",
    });
  }
});
