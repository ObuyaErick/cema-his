import prisma from "~/lib/prisma";

/**
 * Delete note
 */
export default defineEventHandler(async (event) => {
  const noteId = event.context.params?.id;

  if (!noteId) {
    throw createError({
      statusCode: 400,
      message: "Invalid id",
    });
  }

  const body = await readBody<{ title: string; content: string }>(event);

  const note = prisma.note
    .findUniqueOrThrow({ where: { id: noteId } })
    .catch((error) => {
      throw createError({
        statusCode: 404,
        message: "Note not found",
      });
    });

  await prisma.note.delete({
    where: { id: noteId },
  });

  return {
    message: "Note deleted successfully",
  };
});
