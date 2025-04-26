import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ ids: number[] }>(event);
  if (Array.isArray(body?.ids)) {
    const deleted = await prisma.client.deleteMany({
      where: { id: { in: body.ids } },
    });

    return {
      message: deleted.count
        ? `Successfully deleted ${deleted.count} client${
            deleted.count > 1 ? "s" : ""
          }`
        : "No record was deleted. Try selecting at least one",
    };
  }
  throw createError({
    statusCode: 400,
    message: "Please provide at least one entry to delete",
  });
});
