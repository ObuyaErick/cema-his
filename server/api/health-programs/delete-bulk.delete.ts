import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ ids: number[] }>(event);

  if (Array.isArray(body?.ids)) {
    // Unenroll clients from this program
    await prisma.enrollment.deleteMany({
      where: {
        healthProgramId: {
          in: body.ids,
        },
      },
    });

    const result = await prisma.healthProgram.deleteMany({
      where: { id: { in: body.ids } },
    });

    return {
      message: result.count
        ? `Successfully deleted ${result.count} programs(s)`
        : "No record was deleted. Try selecting at least one",
    };
  }
  throw createError({
    statusCode: 400,
    message: "Please provide at least one entry to delete",
  });
});
