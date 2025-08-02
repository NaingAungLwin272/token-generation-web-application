import express from "express";
import userRoutes from './routes/userRoutes'
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);

export default app;
