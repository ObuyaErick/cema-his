import prisma from "~/lib/prisma";

/**
 * Retrieve a list of offered health programs
 */
export default defineEventHandler(async (event) => {
  // Handle GET request - List programs

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
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
    skip: (page - 1) * limit,
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
    page,
    limit,
    total,
  };
});
