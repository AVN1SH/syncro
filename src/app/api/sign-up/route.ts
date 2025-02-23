import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request : Request) {
  await dbConnect();

  try {
    const {name, username, email, password} = await request.json();

    if(!(name && username && email && password)) {
      return Response.json(
        {
          success : false,
          message : "All fields are required"
        }, {status : 400}
      )
    }

    const existingUser = await UserModel.findOne({
      email,
      isVerified : false
    });
    console.log(existingUser);

    if(existingUser) {
      return new NextResponse("Email already exists.", {status : 400})
    }

    const hasedPassword = await bcrypt.hash(password, 10);
     const newUser = new UserModel({
      name,
      username,
      email,
      password : hasedPassword,
      imageUrl : '',
      isVerified : false,
      type : "emailPass"
    })

    const dbResponse = await newUser.save();
    if(!dbResponse) console.log("Error while registering user");
    
    return Response.json(
      {
        success : true,
        message : "User registered successfully"
      }
    )

  } catch (error) {
    console.log("Error while registering user", error);
    return Response.json(
      {
        success : false,
        message : "Error registring User"
      }
    )
  }
}