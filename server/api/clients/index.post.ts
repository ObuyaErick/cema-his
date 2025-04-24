import { PrismaClient } from "~/generated/prisma";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
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
        // Create enrollments if programIds are provided
        enrollments: {
          create: (programIds as number[]).map((programId) => ({
            healthProgram: {
              connect: { id: programId },
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
