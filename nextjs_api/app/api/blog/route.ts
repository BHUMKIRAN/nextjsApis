import { getBlogs, createBlog } from "@/controller/blog";
import { NextResponse } from "next/server";

export async function GET() {
  const blogs = await getBlogs();
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  const { title, description, image, user_id } = await request.json();
  const blogId = await createBlog(title, description, image, user_id);
  return NextResponse.json({ message: "blog created", id: blogId });
}
