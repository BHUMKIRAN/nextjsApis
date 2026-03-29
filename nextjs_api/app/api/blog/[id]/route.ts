import { updateBlog } from "@/controller/blog";
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