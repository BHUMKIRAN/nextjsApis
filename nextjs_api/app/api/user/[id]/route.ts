import { updateUser, getUserById } from "@/controller/user";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { name, email, image } = await request.json();
  const { id } = await params;
  const userId = parseInt(id);
  await updateUser(userId, name, email, image);
  return NextResponse.json({ message: "User updated successfully" });
}

export async function GET( request: Request,{ params }) {
  const { id } = await params;
  const userId = parseInt(id);
  const user = await getUserById(userId);
  return NextResponse.json(user);
}
