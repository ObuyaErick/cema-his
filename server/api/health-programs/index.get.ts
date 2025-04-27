import prisma from "~/lib/prisma";
import normalizePaginationParams from "~/shared/utils/normalize-pagination-params";

/**
 * Retrieve a list of offered health programs
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { page: oneBasedPage, limit } = normalizePaginationParams(query, {
    limit: 10,
  });
  const zeroBasedPage = oneBasedPage - 1;
  const search = query.search as string;
  const dateFrom = query.dateFrom as string;
  const dateTo = query.dateTo as string;

  // Prepare filters
  const filters: any = {};

  // Add date filters if provided
  if (dateFrom || dateTo) {
    filters.createdAt = {};
    if (dateFrom) filters.createdAt.gte = new Date(dateFrom);
    if (dateTo) filters.createdAt.lte = new Date(dateTo);
  }

  // Add search filter if provided
  if (search) {
    filters.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // Get total count
  const total = await prisma.healthProgram.count({
    where: filters,
  });

  // Get paginated data
  const data = await prisma.healthProgram.findMany({
    where: filters,
    skip: zeroBasedPage * limit,
    take: limit,
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
  });

  return {
    data,
    page: oneBasedPage,
    limit,
    total,
  };
});
