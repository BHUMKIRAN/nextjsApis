import { updateBlog , deleteBlog ,getBlogByUserId } from "@/controller/blog";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
    const { title, description, image } = await request.json();        
    const { id } = await params;
    const blogId = parseInt(id);
    await updateBlog(blogId, title, description, image);
    return NextResponse.json({ message: "blog updated successfully" });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const blogId = parseInt(id);
  await deleteBlog(blogId);
  return NextResponse.json({ message: "blog deleted successfully" });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const blogId = parseInt(id);
  const blog = await getBlogByUserId(blogId);
  return NextResponse.json(blog);
}