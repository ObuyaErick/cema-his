import prisma from "~/lib/prisma";
import { ClientRegistrationSchema } from "~/shared/types/clients.types";

/**
 * Creates a new client
 */
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Invalid client id",
    });
  }

  // Check if client exists
  const client = await prisma.client
    .findUniqueOrThrow({
      where: { id },
    })
    .catch(() => {
      throw createError({
        statusCode: 404,
        message: "Client not found",
      });
    });

  try {
    const body = await readBody<ClientRegistrationSchema>(event);

    const acc = {} as ClientRegistrationSchema;

    if (body.firstName) {
      acc.firstName = body.firstName;
    }
    if (body.lastName) {
      acc.lastName = body.lastName;
    }
    if (body.dateOfBirth) {
      acc.dateOfBirth = body.dateOfBirth;
    }
    if (body.gender) {
      acc.gender = body.gender;
    }
    if (body.contactNumber) {
      acc.contactNumber = body.contactNumber;
    }
    if (body.email) {
      acc.email = body.email;
    }
    if (body.address) {
      acc.address = body.address;
    }

    return prisma.$transaction(async (trx) => {
      // Update client details
      await trx.client.update({
        where: {
          id: client.id,
        },
        data: acc,
      });

      //
      if (Array.isArray(body.programIds) && body.programIds.length) {
        const existingEnrollments = await trx.enrollment.findMany({
          where: {
            clientId: client.id,
            healthProgramId: { in: body.programIds },
          },
          select: { healthProgramId: true },
        });

        const existingProgramIds = existingEnrollments.map(
          (e) => e.healthProgramId
        );

        const newProgramIds = body.programIds.filter(
          (pid) => !existingProgramIds.includes(pid)
        );

        if (newProgramIds.length) {
          await trx.enrollment.createMany({
            data: newProgramIds.map((pid) => ({
              clientId: client.id,
              healthProgramId: pid,
            })),
          });
        }
      }

      return {
        message: "Client details updated successfully",
      };
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create client",
    });
  }
});
