import { hashSync } from "bcrypt";
import { User } from "~/generated/prisma";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name } = body;

  let user: User | null = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    throw createError({
      statusCode: 409,
      message: "Email already taken",
    });
  }

  // Hashing password
  const hashedPassword = hashSync(password, 10);

  // Creating new user
  user = await prisma.user
    .create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })
    .catch((_error) => {
      throw createError({
        statusCode: 500,
        message: "Sorry, an error occured during registration",
      });
    });

  return {
    message: "Registration successful",
  };
});
