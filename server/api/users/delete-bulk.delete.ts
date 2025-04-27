import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ ids: string[] }>(event);

  if (Array.isArray(body?.ids)) {
    // Find all clients depending on these users
    const clients = await prisma.client.findMany({
      where: { userId: { in: body.ids } },
      select: { id: true },
    });

    const clientAttachmentIds = clients.map((c) => c.id);

    // Find all enrollments for these attached clients
    const enrollments = await prisma.enrollment.findMany({
      where: { clientId: { in: clientAttachmentIds } },
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

    // Remove any enrollments of these clients
    await prisma.enrollment.deleteMany({
      where: {
        clientId: {
          in: clientAttachmentIds,
        },
      },
    });

    // Remove clients
    await prisma.client.deleteMany({
      where: { id: { in: clientAttachmentIds } },
    });

    // Remove users
    const result = await prisma.user.deleteMany({
      where: { id: { in: body.ids } },
    });

    return {
      message: result.count
        ? `Successfully deleted ${result.count} user(s)`
        : "No record was deleted. Try selecting at least one",
    };
  }
  throw createError({
    statusCode: 400,
    message: "Please provide at least one entry to delete",
  });
});
