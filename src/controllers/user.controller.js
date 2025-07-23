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
    res.status(400).json({ error: "Something went wrong! Try to create a user again." });
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
