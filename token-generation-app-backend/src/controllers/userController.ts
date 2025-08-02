import type { Request, Response, NextFunction } from "express";
import { UserRequestPayload, type UserResponse } from '../models/userModel';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient()

async function generateToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function generateUniqueToken(prisma: PrismaClient): Promise<string> {
  let token: string;
  let exists: boolean;
  do {
    token = await generateToken();
    const found = await prisma.user.findFirst({ where: { token } });
    exists = Boolean(found);
  } while (exists);
  return token;
}

export const createUser = async (req: Request, res: Response) => {
  const { name, phoneNumber, companyName, designation } = req.body as Omit<
    UserRequestPayload,
    'token'
  >;

  if (!name || !phoneNumber || !companyName) {
    return res
      .status(400)
      .json({ message: 'Name, phoneNumber, and companyName are required.' });
  }

  try {
    const token = await generateUniqueToken(prisma);
    const participant = await prisma.user.create({
      data: { name, phoneNumber, companyName, designation, token },
    });

    const userResponse: UserResponse = {
      id: participant.id,
      name: participant.name,
      phoneNumber: participant.phoneNumber,
      companyName: participant.companyName,
      designation: participant.designation ?? undefined,
      token: participant.token,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      (error.meta?.target as string[]).includes('name')
    ) {
      return res.status(409).json({ message: 'Name must be unique.' });
    }
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

    const participant = await prisma.user.findUnique({
      where: { id },
    });

    if (!participant) return res.status(404).json({ message: 'User not found' });

    const userResponse: UserResponse = {
      id: participant.id,
      name: participant.name,
      phoneNumber: participant.phoneNumber,
      companyName: participant.companyName,
      designation: participant.designation ?? undefined,
      token: participant.token,
    };

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
