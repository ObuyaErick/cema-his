import { PrismaClient } from "~/generated/prisma";
import { compareSync, hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();
const runtimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{
    email: string;
    password: string;
  }>(event);

  // Check if user exists
  const user = await prisma.user
    .findUniqueOrThrow({
      where: { email },
    })
    .catch((_error) => {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    });

  // Check if passwords are matching
  const passwordsMatch = compareSync(hashSync(password, 10), user.password);

  if (!passwordsMatch) {
    throw createError({
      statusCode: 401,
      message: "Wrong password",
    });
  }

  // Create a JWT token expiring in after 3 hours from the time of creation
  const token = sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    runtimeConfig.jwtSecret,
    { expiresIn: "3Hours" }
  );

  setCookie(event, "session", token, {
    // Prevent access by javascript
    httpOnly: true,
    // Using TLS in production
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 3, // Not sent when 3 hours has elapsed,
    sameSite: "strict",
  });

  return {
    message: "You have successfully logged in",
  };
});
