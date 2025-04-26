import prisma from "~/lib/prisma";
import { ClientRegistrationSchema } from "~/shared/types/clients.types";

/**
 * Creates a new client
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ClientRegistrationSchema>(event);
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      address,
      programIds = [],
    } = body;

    // Create client
    await prisma.client.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        contactNumber,
        email,
        address,
        enrollments: {
          create: programIds.map((programId) => ({
            healthProgram: {
              connect: { id: Number(programId) },
            },
          })),
        },
      },
      include: {
        enrollments: {
          include: {
            healthProgram: true,
          },
        },
      },
    });

    return {
      message: "Client registration successful",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create client",
    });
  }
});
