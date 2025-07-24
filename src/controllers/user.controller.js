import express from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../auth.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashPassword },
    });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Something went wrong! Try to create a user again." });
  }
}

export async function getUser(req, res) {
  try {
    const { email, password } = req.body;

    console.log('login attempt', { email, password })

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log('user fetched from db:', user)

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = generateToken({ id: user.id, email: user.email });
    console.log('token', token  )

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Error in getUser:", err);
    res.status(500).json({ error: "Something went wrong! Try again" });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong! Try again." });
  }
}
