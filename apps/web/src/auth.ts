import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, createDatabaseClient, users } from "@waypoint/db";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getApiUrl } from "./lib/api-url";
import {
  AUTH_JWT_MAX_AGE_SECONDS,
  decodeAuthJwt,
  encodeAuthJwt,
} from "./lib/auth-jwt";
import { env } from "./lib/env";

const db = createDatabaseClient(env.DATABASE_URL);

type AuthUserResponse = {
  data: {
    user: {
      id: string;
      email: string;
      image: string | null;
      name: string | null;
    };
  };
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  callbacks: {
    authorized({ auth: session }) {
      return Boolean(session?.user);
    },
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  jwt: {
    decode: decodeAuthJwt,
    encode: encodeAuthJwt,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        try {
          const response = await fetch(`${getApiUrl()}/auth/login`, {
            body: JSON.stringify({ email, password }),
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });

          if (!response.ok) {
            return null;
          }

          const body: unknown = await response.json();

          if (!isAuthUserResponse(body)) {
            return null;
          }

          return body.data.user;
        } catch {
          return null;
        }
      },
    }),
  ],
  secret: env.AUTH_SECRET,
  session: {
    maxAge: AUTH_JWT_MAX_AGE_SECONDS,
    strategy: "jwt",
  },
  trustHost: true,
});

function isAuthUserResponse(value: unknown): value is AuthUserResponse {
  if (typeof value !== "object" || value === null || !("data" in value)) {
    return false;
  }

  const data = value.data;

  if (typeof data !== "object" || data === null || !("user" in data)) {
    return false;
  }

  const user = data.user;

  return (
    typeof user === "object" &&
    user !== null &&
    "id" in user &&
    "email" in user &&
    typeof user.id === "string" &&
    typeof user.email === "string"
  );
}
