import prisma from "~/lib/prisma";

/**
 * Add note to enrolled programs
 */
export default defineEventHandler(async (event) => {
  const clientId = event.context.params?.id;
  const programId = event.context.params?.programId;

  if (!clientId || !programId) {
    throw createError({
      statusCode: 400,
      message: "Invalid client or program id",
    });
  }

  const body = await readBody<{ title: string; content: string }>(event);

  const enrollment = await prisma.enrollment
    .findUniqueOrThrow({
      where: {
        clientId_healthProgramId: {
          clientId,
          healthProgramId: programId,
        },
      },
    })
    .catch((error) => {
      throw createError({
        statusCode: error.statusCode || 404,
        message: "Client is not enrolled in this pogram",
      });
    });

  try {
    await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        enrollmentId: enrollment.id,
      },
    });

    return {
      message: "New note added",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to add note",
    });
  }
});
