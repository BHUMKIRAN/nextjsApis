import {getUsers , createUser} from "@/controller/user.js";
import { NextResponse } from "next/server";

export async function GET(){
    const users = await getUsers();
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const { name, email, image } = await request.json();
    const userId = await createUser(name, email, image);
    return NextResponse.json({ id: userId });
}
