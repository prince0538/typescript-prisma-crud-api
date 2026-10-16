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

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
      })
    }
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, age: Number(age) },
    });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(req.params.id) },
    });
    if (!user) {
      res.status(404).json({
         error: "User not found" 
   });
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
    const id = String(req.params.id);
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      res.status(404).json({ 
        error: "User not found"
       });
      return;
    }

    const data = { name: req.body.name, email: req.body.email, password: req.body.password, age: req.body.age };
    if (data.email) {
      data.email = data.email.toLowerCase();
      const userWithEmail = await prisma.user.findFirst({
        where: { email: data.email, id: { not: id } },
      });
      if (userWithEmail) {
        res.status(409).json({ 
          error: "Email already exists" 
        });
        return;
      }
    }
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    if (data.age !== undefined) data.age = Number(data.age);

    const user = await prisma.user.update({
      where: { id },
      data,
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      res.status(404).json({ 
        error: "User not found" 
      });
      return;
    }

    await prisma.user.delete({ where: { id } });
    res.status(200).send({
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};
