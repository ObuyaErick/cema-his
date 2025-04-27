import { Client } from "~/generated/prisma";
import prisma from "~/lib/prisma";
import { Paginated } from "~/shared/types/pagination.types";
import normalizePaginationParams from "~/shared/utils/normalize-pagination-params";

/**
 * Retrieves a list of clients with filtering options
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { search, gender, dateFrom, dateTo } = query;
    const { page: oneBasedPage, limit } = normalizePaginationParams(query, {
      limit: 10,
    });
    const zeroBasedPage = oneBasedPage - 1;

    let whereClause: any = {};

    // Use search query string if provided
    if (search) {
      whereClause = {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // Gender filter
    if (gender) {
      whereClause.gender = gender;
    }

    // Date range filters
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};

      if (dateFrom) {
        whereClause.createdAt.gte = new Date(String(dateFrom));
      }

      if (dateTo) {
        // Set time to end of day for the dateTo
        const endDate = new Date(String(dateTo));
        endDate.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = endDate;
      }
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      skip: zeroBasedPage * limit,
      take: limit,
      include: {
        enrollments: {
          include: {
            healthProgram: true,
          },
        },
      },
    });

    // Transform the data to include programs in a more accessible format
    const clientsWithPrograms = clients.map((client) => {
      const { enrollments, ...clientData } = client;
      return {
        ...clientData,
        healthPrograms: enrollments.map(
          (enrollment) => enrollment.healthProgram
        ),
      };
    });

    const total = await prisma.client.count({
      where: whereClause,
    });

    const paginatedClients: Paginated<Client> = {
      data: clientsWithPrograms,
      total,
      page: oneBasedPage,
      limit,
    };

    return paginatedClients;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch clients",
    });
  }
});
