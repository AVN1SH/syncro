import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    dbConnect();

    const { username } = await req.json();

    if(!username) return new NextResponse("Username is required", { status: 400 });

    const user = await UserModel.findOne({ username });

    if(user) return new NextResponse("Username already exists", { status: 400 });

    return NextResponse.json({message : "Username is available"});

  } catch (error) {
    console.log("Error while checking username", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}