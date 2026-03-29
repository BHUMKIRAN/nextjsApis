import db from "../lib/db";

export const getBlogs = async () => {
  try {
    const [rows] = await db.query("SELECT users.name, blog.title FROM users INNER JOIN blog ON users.id = blog.user_id");
    return rows;
  } catch (error) {
    console.error(error);
  }
};

export const createBlog = async (user_id, title, description, image) => {
  try {
    const [result] = await db.query(
      `INSERT INTO blog (title, description, image , user_id) VALUES (?, ?, ?, ?)`,
      [user_id, title, description, image],
    );
    return result.insertId;
  } catch (error) {
    console.error(error);
  }
};

export const updateBlog = async (id, title, description, image) => {
  try {
    await db.query(`UPDATE blog SET title = ?, description = ?, image = ? WHERE id = ?`, [title, description, image, id]);
  } catch (error) {
    console.error(error);
  }
};