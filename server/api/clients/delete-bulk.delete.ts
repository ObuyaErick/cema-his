import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ ids: string[] }>(event);

  if (Array.isArray(body?.ids)) {
    // Find all enrollments for these clients
    const enrollments = await prisma.enrollment.findMany({
      where: { clientId: { in: body.ids } },
      select: { id: true },
    });

    const enrollmentIds = enrollments.map((e) => e.id);

    // Remove notes
    await prisma.note.deleteMany({
      where: {
        enrollmentId: {
          in: enrollmentIds,
        },
      },
    });

    // Remove any enrollments of this client
    await prisma.enrollment.deleteMany({
      where: {
        clientId: {
          in: body.ids,
        },
      },
    });

    const result = await prisma.client.deleteMany({
      where: { id: { in: body.ids } },
    });

    return {
      message: result.count
        ? `Successfully deleted ${result.count} client(s)`
        : "No record was deleted. Try selecting at least one",
    };
  }
  throw createError({
    statusCode: 400,
    message: "Please provide at least one entry to delete",
  });
});
