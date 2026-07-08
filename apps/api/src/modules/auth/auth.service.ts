import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Database, User } from "@waypoint/db" with { "resolution-mode": "import" };
import { compare, hash } from "bcryptjs";
import { DATABASE_CONNECTION } from "../../database/database.constants";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";

const PASSWORD_HASH_ROUNDS = 12;

export type PublicAuthUser = {
  email: string;
  id: string;
  image: string | null;
  name: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async register(dto: RegisterDto) {
    const { eq, users } = await getDatabaseHelpers();
    const email = normalizeEmail(dto.email);
    const name = normalizeName(dto.name);
    const passwordHash = await hash(dto.password, PASSWORD_HASH_ROUNDS);
    const existingUser = await this.findUserByEmail(email);

    if (existingUser?.passwordHash) {
      throw new ConflictException("Já existe uma conta com esse email.");
    }

    if (existingUser) {
      const [updatedUser] = await this.db
        .update(users)
        .set({
          name: existingUser.name ?? name,
          passwordHash,
        })
        .where(eq(users.id, existingUser.id))
        .returning();

      return this.toPublicUser(updatedUser);
    }

    try {
      const [createdUser] = await this.db
        .insert(users)
        .values({
          email,
          name,
          passwordHash,
        })
        .returning();

      return this.toPublicUser(createdUser);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException("Já existe uma conta com esse email.");
      }

      throw error;
    }
  }

  async login(dto: LoginDto) {
    const email = normalizeEmail(dto.email);
    const user = await this.findUserByEmail(email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException("Email ou senha inválidos.");
    }

    const passwordMatches = await compare(dto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException("Email ou senha inválidos.");
    }

    return this.toPublicUser(user);
  }

  private async findUserByEmail(email: string) {
    const { eq, users } = await getDatabaseHelpers();
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  private toPublicUser(user: User): PublicAuthUser {
    return {
      email: user.email,
      id: user.id,
      image: user.image,
      name: user.name,
    };
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeName(name: string | undefined) {
  const normalized = name?.trim();
  return normalized ? normalized : null;
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

async function getDatabaseHelpers() {
  const [{ users }, { eq }] = await Promise.all([
    import("@waypoint/db"),
    import("drizzle-orm"),
  ]);

  return { eq, users };
}
