import { hashSync } from "bcrypt";
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

    // Create login record for client
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email.trim(),
        role: "client",
        // Default password is the provided email
        password: hashSync(email.trim(), 10),
      },
    });

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
        userId: user.id,
        enrollments: {
          create: programIds.map((programId) => ({
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
      message:
        "Client registration successful. Use your email as your password to log in.",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create client",
    });
  }
});
