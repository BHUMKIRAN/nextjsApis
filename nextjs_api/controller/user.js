import db from "@/lib/db.js";
import { NextResponse } from "next/server";
import redis from "@/lib/redis.js";

const cacheKey = "users";
export const getUsers = async () => {
  const cachedUsers = await redis.get(cacheKey);

  if (cachedUsers) {
    console.log("Serving users from cache");
    return NextResponse.json(JSON.parse(cachedUsers));
  }
  try {
    const [rows] = await db.query("SELECT * FROM users");
    await redis.set(cacheKey, JSON.stringify(rows), "EX", 3600);
    console.log("Serving users from database");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (name, email, image) => {
  try {
    const [result] = await db.query(
      `INSERT INTO users (name, email , image) VALUES (?, ? ,?)`,
      [name, email, image],
    );
    await redis.del(cacheKey);
    console.log("User created, cache invalidated");
    return result.insertId;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, name, email, image) => {
  try {
    await db.query(
      `UPDATE users SET name = ?, email = ? , image = ? WHERE id = ?`,
      [name, email, image, id],
    );
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
