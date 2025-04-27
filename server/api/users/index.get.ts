import prisma from "~/lib/prisma";
import { Paginated } from "~/shared/types/pagination.types";
import { UIUser } from "~/shared/types/users.types";
import normalizePaginationParams from "~/shared/utils/normalize-pagination-params";

/**
 * Retrieves a list of users with filtering options
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { search } = query;
    const { page: oneBasedPage, limit } = normalizePaginationParams(query, {
      limit: 10,
    });
    const zeroBasedPage = oneBasedPage - 1;

    let whereClause: any = {};

    // Use search query string if provided
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      skip: zeroBasedPage * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await prisma.user.count({
      where: whereClause,
    });

    const paginatedUsers: Paginated<UIUser> = {
      data: users,
      total,
      page: oneBasedPage,
      limit,
    };

    return paginatedUsers;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch users",
    });
  }
});
