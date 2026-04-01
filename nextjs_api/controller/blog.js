import db from "../lib/db";
import redis from "@/lib/redis";
const cachekey = "blogs";
export const getBlogs = async () => {
  const cachedBlogs = await redis.get(cachekey);
  if (cachedBlogs) {
    console.log("Serving blogs from cache");
    return JSON.parse(cachedBlogs);
  }
  try {
    const [rows] = await db.query(
      "SELECT users.name, blog.title FROM users INNER JOIN blog ON users.id = blog.user_id",
    );
    await redis.set(cachekey, JSON.stringify(rows), "EX", 3600);
    console.log("Serving blogs from database");
    return rows;
  } catch (error) {
    console.error(error);
  }
};

export const getBlogByUserId = async (user_id) => {
  const cacheKey = `blogs_user_${user_id}`;
  const cachedBlogs = await redis.get(cacheKey);
  if (cachedBlogs) {
    console.log(`Serving blogs for user ${user_id} from cache`);
    return JSON.parse(cachedBlogs);
  }
  const id = parseInt(user_id);
  try {
    const [rows] = await db.query("SELECT * FROM blog WHERE user_id = ?", [id]);
    await redis.set(cacheKey, JSON.stringify(rows), "EX", 3600);
    console.log(`Serving blogs for user ${user_id} from database`);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

export const createBlog = async (user_id, title, description, image) => {
  try {
    const [result] = await db.query(
      `INSERT INTO blog (title, description, image , user_id) VALUES (?, ?, ?, ?)`,
      [user_id, title, description, image],
    );
    await redis.del(cachekey);
    await redis.del(`blogs_user_${user_id}`);
    console.log("Blog created, cache invalidated");
    return result.insertId;
  } catch (error) {
    console.error(error);
  }
};

export const updateBlog = async (id, title, description, image) => {
  try {
    await db.query(
      `UPDATE blog SET title = ?, description = ?, image = ? WHERE id = ?`,
      [title, description, image, id],
    );
    await redis.del(cachekey);
    console.log("Blog updated, cache invalidated");
  } catch (error) {
    console.error(error);
  }
};

export const deleteBlog = async (id) => {
  const blogId = parseInt(id);
  try {
    const [result] = await db.query(`DELETE FROM blog WHERE id = ?`, [blogId]);
    if (result.affectedRows === 0) {
      return JSON.stringify({ message: "Blog not found" });
    }
    await redis.del(cachekey);
    console.log("Blog deleted, cache invalidated");
    return JSON.stringify({ message: "Blog deleted successfully" });
  } catch (e) {
    console.log(e);
  }
};
