import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const user = await prisma.user.create({
      data: { name, email, password },
    });

    res.status(201).json(user);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Something went wrong! Try to create a user again." });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong! Try again." });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong, try again." });
  }
}

export async function getUserByName(req, res) {
  try {
    const { name } = req.query;

    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong, try again." });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: `User with ID ${id} deleted succesfully.` });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong, try again." });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        name: name || existingUser.name,
        email: email || existingUser.email,
        password: password || existingUser.password,
      },
    });

    res.json(updateUser);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong, try again." });
  }
}
