import db from "@/lib/db.js";
import { NextResponse } from "next/server";
import redis from "@/lib/redis.js";

const cacheKeyUser = "users";
export const getUsers = async () => {
  const cachedUsers = await redis.get(cacheKeyUser);

  if (cachedUsers) {
    console.log("Serving users from cache");
    return NextResponse.json(JSON.parse(cachedUsers));
  }
  try {
    const [rows] = await db.query("SELECT * FROM users");
    await redis.set(cacheKeyUser, JSON.stringify(rows), "EX", 3600);
    console.log("Serving users from database");
    return rows;
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
    await redis.del(`user_${result.insertId}`);
    console.log("User created, cache invalidated");
    return result.insertId;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, name, email, image) => {
  const cacheKey = `user_${id}`;

  const cachedUser = await redis.get(cacheKey);
  if (cachedUser) {
    console.log(`Serving user ${id} from cache`);
    return JSON.parse(cachedUser);
  }

  try {
    await db.query(
      `UPDATE users SET name = ?, email = ? , image = ? WHERE id = ?`,
      [name, email, image, id],
    );
    await redis.del(cacheKey);
    console.log(`User ${id} updated, cache invalidated`);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  const userId = parseInt(id);
  try {
    const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [userId]);
    if (result.affectedRows === 0) {
      console.log("No user found with the given ID");
    } else {
      console.log("User deleted successfully");
    }
    await redis.del(cacheKey);
    console.log("User deleted, cache invalidated");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export const getUserById = async (id) => {
   const cacheKey = `user_${id}`;
  const cachedUser = await redis.get(cacheKey);
  if (cachedUser) {
    console.log(`Serving user ${id} from cache`);
    return JSON.parse(cachedUser);
  } else {
    try {
      const userId = parseInt(id);
      const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [userId]);
      if (rows.length > 0) {
        await redis.set(cacheKey, JSON.stringify(rows[0]), "EX", 3600);
        console.log(`Serving user ${id} from database`);
        return rows[0];
      } else {
        console.log("No user found with the given ID");
      }
    } catch (error) {
      console.error("Error fetching user by ID:", error); 
    }
  }
};