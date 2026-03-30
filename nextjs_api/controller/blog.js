import db from "../lib/db";
import redis from "@/lib/redis";
export const getBlogs = async () => {

  const cachekey = "blogs";
  const cachedBlogs = await redis.get(cachekey);

  if(cachedBlogs){
    console.log("Serving blogs from cache");
    return JSON.parse(cachedBlogs);
  }
  try {
    const [rows] = await db.query("SELECT users.name, blog.title FROM users INNER JOIN blog ON users.id = blog.user_id");
    await redis.set(cachekey, JSON.stringify(rows), "EX", 3600);
    console.log("Serving blogs from database");
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