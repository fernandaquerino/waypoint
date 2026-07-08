import type { JWT, JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export const AUTH_JWT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export async function encodeAuthJwt({
  maxAge = AUTH_JWT_MAX_AGE_SECONDS,
  secret,
  token,
}: JWTEncodeParams) {
  if (!token) {
    throw new Error("Cannot encode an empty auth token");
  }

  return new SignJWT(token as JWTPayload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(getSecretKey(secret));
}

export async function decodeAuthJwt({ secret, token }: JWTDecodeParams) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey(secret), {
      algorithms: ["HS256"],
    });

    return payload as JWT;
  } catch {
    return null;
  }
}

function getSecretKey(secret: string | string[]) {
  const value = Array.isArray(secret) ? secret[0] : secret;

  if (!value) {
    throw new Error("AUTH_SECRET must be defined to sign auth tokens");
  }

  return new TextEncoder().encode(value);
}
