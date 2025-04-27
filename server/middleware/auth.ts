import jwt from "jsonwebtoken";
import prisma from "~/lib/prisma";
import { AuthenticationContext } from "~/shared/types/auth.types";

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  if (!path.startsWith("/api/")) {
    return;
  }

  const publicRoutes = ["/api/auth/login", "/api/auth/register"];

  if (publicRoutes.includes(path)) {
    return;
  }

  const sessionCookie = getCookie(event, "session");

  if (!sessionCookie) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized access",
    });
  }

  const runtimeConfig = useRuntimeConfig();

  let decodedToken: AuthenticationContext;

  try {
    decodedToken = jwt.verify(
      sessionCookie,
      runtimeConfig.jwtSecret
    ) as AuthenticationContext;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw createError({
        statusCode: 401,
        statusMessage: "TokenExpired",
        message: "Your login session has expired.",
      });
    } else if (error.name === "JsonWebTokenError") {
      throw createError({
        statusCode: 401,
        message: "Invalid login session. Login again.",
      });
    }

    throw createError({
      statusCode: 401,
      message:
        "Could to authenticate your session. Please consider logging in again.",
    });
  }

  const user = await prisma.user
    .findUniqueOrThrow({
      where: { id: decodedToken.id },
    })
    .catch((_error) => {
      throw createError({
        statusCode: 403,
        message: "Forbidden access. Invalid user.",
      });
    });

  const client = await prisma.client.findFirst({
    where: {
      userId: user.id,
    },
  });

  const session: AuthenticationContext = {
    name: user.name,
    email: user.email,
    id: user.id,
    role: user.role,
    authClientId: client ? client.id : null,
  };

  // Setting authentication context
  event.context.auth = session;
});
