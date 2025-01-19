import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { connectionId: string } }
) {
  try {
    const user = await currentUser();
    const { name, profilePhotoUrl } = await req.json();

    if(!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const updatedConnection = await ConnectionModel.findByIdAndUpdate(
      {
        _id : params.connectionId,
        user : user._id,
      }, 
      {
        $set : {
          name,
          profilePhotoUrl
        }
      }, { new : true}
    );

    return NextResponse.json(updatedConnection);

  } catch (error) {
    console.log("connection id patch error : ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}