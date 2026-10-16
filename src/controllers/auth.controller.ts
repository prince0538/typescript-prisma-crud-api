import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password || age === undefined) {
      res
        .status(400)
        .json({ error: "name, email, password and age are required" });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, age: Number(age) },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(req.params.id) },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const data = { name: req.body.name, email: req.body.email, password: req.body.password, age: req.body.age };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    if (data.age !== undefined) data.age = Number(data.age);

    const user = await prisma.user.update({
      where: { id: String(req.params.id) },
      data,
    });
    res.json(user);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (error.code === "P2002") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: String(req.params.id) } });
    res.status(200).send({
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(500).json({ error: error.message });
  }
};
