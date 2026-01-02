import { sign } from "hono/jwt";
import prisma from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const validatePokePokeId = (id: string) => {
  // Requirement: 10 characters alphanumeric
  return /^[A-Z0-9]{10}$/.test(id);
};

export const register = async (
  pokePokeId: string,
  name: string,
  password: string
) => {
  if (!validatePokePokeId(pokePokeId)) {
    throw new Error("Invalid PokePoke ID format");
  }

  const existing = await prisma.user.findUnique({ where: { pokePokeId } });
  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await Bun.password.hash(password);

  const user = await prisma.user.create({
    data: {
      pokePokeId,
      name,
      passwordHash,
    },
  });

  // Basic payload
  const payload = {
    id: user.id,
    role: user.role,
    isBlacklisted: user.isBlacklisted,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
  };

  const token = await sign(payload, JWT_SECRET);
  return {
    token,
    user: {
      id: user.id,
      pokePokeId: user.pokePokeId,
      name: user.name,
      role: user.role,
    },
  };
};

export const login = async (pokePokeId: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { pokePokeId } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await Bun.password.verify(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const payload = {
    id: user.id,
    role: user.role,
    isBlacklisted: user.isBlacklisted,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
  };

  const token = await sign(payload, JWT_SECRET);
  return {
    token,
    user: {
      id: user.id,
      pokePokeId: user.pokePokeId,
      name: user.name,
      role: user.role,
    },
  };
};

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }
  // Exclude sensitive data
  return {
    id: user.id,
    pokePokeId: user.pokePokeId,
    name: user.name,
    role: user.role,
    isBlacklisted: user.isBlacklisted,
    createdAt: user.createdAt,
  };
};
