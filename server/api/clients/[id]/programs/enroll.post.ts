import prisma from "~/lib/prisma";

/**
 * Creates a new client
 */
export default defineEventHandler(async (event) => {
  const clientId = event.context.params?.id;

  const body = await readBody<{ programIds: string[] }>(event);
  const { programIds = [] } = body;

  await prisma.client
    .findUniqueOrThrow({ where: { id: clientId } })
    .catch((_error) => {
      throw createError({
        statusCode: 404,
        message: "Client not found",
      });
    });

  // Create client
  if (!programIds.length) {
    throw createError({
      statusCode: 400,
      message: "No program selected",
    });
  }

  const result = await prisma.enrollment
    .createMany({
      data: programIds.map((healthProgramId) => ({
        healthProgramId,
        clientId: String(clientId),
      })),
    })
    .catch((error) => {
      throw createError({
        statusCode: 500,
        message:
          error.message || "Failed to enroll client to selected programs",
      });
    });

  return {
    message: `Client successfully registered into ${result.count} program(s)`,
  };
});
