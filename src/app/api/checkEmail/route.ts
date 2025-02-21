import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    dbConnect();

    const { email } = await req.json();

    if(!email) return new NextResponse("Email is required", { status: 400 });

    const user = await UserModel.findOne({ email });

    if(user) return new NextResponse("Email already exists", { status: 400 });

    return NextResponse.json({message : "Email is available"});

  } catch (error) {
    console.log("Error while checking email", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}