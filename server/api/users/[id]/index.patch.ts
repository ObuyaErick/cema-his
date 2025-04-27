import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id;
  const user = await prisma.user
    .findUniqueOrThrow({
      where: {
        id: String(userId),
      },
    })
    .catch((_error) => {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    });

  const body = await readBody<{ role: string }>(event);

  if (["doctor", "client", "none"].includes(body.role)) {
    const role =
      body.role === "doctor" || body.role === "client" ? body.role : null;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: role,
      },
    });

    return {
      message: "Role modified successfully",
    };
  } else {
    throw createError({
      statusCode: 400,
      message: "Invalid role",
    });
  }
});
