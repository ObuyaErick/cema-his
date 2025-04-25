import prisma from "~/lib/prisma";

/**
 * Retrieves a list of clients
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { search } = query;

    let whereClause = {};

    if (search) {
      whereClause = {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return clients;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch clients",
    });
  }
});
