import db from "@/lib/db.js";

export const getUsers = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM users");

    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (name, email , image) => {
  try {
    const [result] = await db.query(
      `INSERT INTO users (name, email , image) VALUES (?, ? ,?)`,
      [name, email, image],
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, name, email , image) => {
  try {
    await db.query(`UPDATE users SET name = ?, email = ? , image = ? WHERE id = ?`, [name, email , image, id]);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};