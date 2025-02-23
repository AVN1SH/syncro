import { currentUser } from "@/lib/currentUser";
import FriendModel from "@/model/friend.model";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req : Request) {
  try {
    const {requestedUserId, username } = await req.json();
    const user = await currentUser();
    
    if(!user) return new NextResponse("Unauthorized", { status : 401 });

    if(requestedUserId) {
      if(!requestedUserId) return new NextResponse("Requested User Id is required", { status : 400 });
  
      const checkingFriendRequest = await FriendModel.aggregate([
        {
          $match : {
            $or : [
              {
                requestingUser : new mongoose.Types.ObjectId(user._id),
                requestedUser : new mongoose.Types.ObjectId(requestedUserId as string)
              },
              {
                requestingUser : new mongoose.Types.ObjectId(requestedUserId as string),
                requestedUser : new mongoose.Types.ObjectId(user._id)
              }
            ]
          }
        }
      ])

  
      if(checkingFriendRequest.length) return new NextResponse("Friend request already sent", {status : 409 });
      
      const friendRequest = await FriendModel.create({
        requestingUser : new mongoose.Types.ObjectId(user._id),
        requestedUser : new mongoose.Types.ObjectId(requestedUserId as string),
        status : "pending"
      });
  
      if(!friendRequest) return new NextResponse("Error while creating friend request", { status : 400 });
  
      //updating User Model..
  
      await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
        $push : {
          friends : friendRequest._id
        }
      });
  
      await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(requestedUserId as string), {
        $push : {
          friends : friendRequest._id
        }
      });
  
      return NextResponse.json(friendRequest);
    }


    if(username) {

      if(!username) return new NextResponse("username is required", { status : 400 });

      if(username === user.username) return new NextResponse("You cannot send friend request to yourself", { status : 400 });

      const requestedUser = await UserModel.findOne({ username : username });
      
      if(!requestedUser) return new NextResponse("User not found", { status : 404 });

      const checkingFriendRequest = await FriendModel.aggregate([
        {
          $match : {
            $or : [
              {
                requestingUser : new mongoose.Types.ObjectId(user._id),
                requestedUser : requestedUser._id
              },
              {
                requestingUser : requestedUser._id,
                requestedUser : new mongoose.Types.ObjectId(user._id)
              }
            ]
          }
        }
      ])

      if(checkingFriendRequest.length) return new NextResponse("Friend request already sent", {status : 409 });
      
      const friendRequest = await FriendModel.create({
        requestingUser : new mongoose.Types.ObjectId(user._id),
        requestedUser : requestedUser._id,
        status : "pending"
      });
  
      if(!friendRequest) return new NextResponse("Error while creating friend request", { status : 400 });
  
      //updating User Model..
  
      await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
        $push : {
          friends : friendRequest._id
        }
      });
  
      await UserModel.findByIdAndUpdate(requestedUser._id, {
        $push : {
          friends : friendRequest._id
        }
      });
  
      return NextResponse.json(friendRequest);
    }
    
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status : 500 });
  }
}

export async function PATCH(req : Request) {
  try {
    const {requestingUserId} = await req.json();
    
    const user = await currentUser();

    if(!user) return new NextResponse("Unauthorized", { status : 401 });

    if(!requestingUserId) return new NextResponse("Requesting User Id is required", { status : 400 });

    const checkingFriendRequest = await FriendModel.aggregate([
      {
        $match : {
          requestingUser : new mongoose.Types.ObjectId(requestingUserId as string),
          requestedUser : new mongoose.Types.ObjectId(user._id)
        }
      }
    ])
    
    if(!checkingFriendRequest.length) return new NextResponse("Friend request not found", { status : 404 });

    if(checkingFriendRequest[0].status !== "pending") return new NextResponse("Friend request already accepted", { status : 409 });

    const updatedFriendRequest = await FriendModel.findByIdAndUpdate(checkingFriendRequest[0]._id, {
      status : "accepted"
    }, { new : true });

    if(!updatedFriendRequest) return new NextResponse("Error while updating friend request", { status : 400 });

    return NextResponse.json(updatedFriendRequest);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status : 500 });
  }
}

export async function DELETE(req : Request) {
  try {
    const {requestingUserId, requestedUserId} = await req.json();

    const user = await currentUser();

    if(!user) return new NextResponse("Unauthorized", { status : 401 });

    if(requestingUserId) {
      if(!requestingUserId) return new NextResponse("Requesting User Id is required", { status : 400 });
  
      const checkingFriendRequest = await FriendModel.aggregate([
        {
          $match : {
            requestingUser : new mongoose.Types.ObjectId(requestingUserId as string),
            requestedUser : new mongoose.Types.ObjectId(user._id)
          }
        }
      ])
      
      if(!checkingFriendRequest.length) return new NextResponse("Friend request not found", { status : 404 });
  
      if(checkingFriendRequest[0].status !== "pending") return new NextResponse("Friend request already accepted", { status : 409 });
  
      const deleteFriendRequest = await FriendModel.findByIdAndDelete(checkingFriendRequest[0]._id);
  
      if(!deleteFriendRequest) return new NextResponse("Error while updating friend request", { status : 400 });
  
      //updating user model...
  
      const updatedUser = await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
        $pull : {
          friends : deleteFriendRequest._id
        }
      });
  
      if(!updatedUser) new NextResponse("Error while upding user model", {status : 400})
  
      const updatedUser2 = await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(requestingUserId as string), {
        $pull : {
          friends : deleteFriendRequest._id
        }
      });
  
      if(!updatedUser2) new NextResponse("Error while upding user model", {status : 400})
  
      return NextResponse.json(deleteFriendRequest);
    }

    if(requestedUserId) {
      if(!requestedUserId) return new NextResponse("Requesting User Id is required", { status : 400 });
  
      const checkingFriendRequest = await FriendModel.aggregate([
        {
          $match : {
            requestingUser : new mongoose.Types.ObjectId(user._id),
            requestedUser : new mongoose.Types.ObjectId(requestedUserId as string)
          }
        }
      ])
      
      if(!checkingFriendRequest.length) return new NextResponse("Friend request not found", { status : 404 });
  
      if(checkingFriendRequest[0].status !== "pending") return new NextResponse("Friend request already accepted", { status : 409 });
  
      const deleteFriendRequest = await FriendModel.findByIdAndDelete(checkingFriendRequest[0]._id);
  
      if(!deleteFriendRequest) return new NextResponse("Error while updating friend request", { status : 400 });
  
      //updating user model...
  
      const updatedUser = await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
        $pull : {
          friends : deleteFriendRequest._id
        }
      });
  
      if(!updatedUser) new NextResponse("Error while upding user model", {status : 400})
  
      const updatedUser2 = await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(requestedUserId as string), {
        $pull : {
          friends : deleteFriendRequest._id
        }
      });
  
      if(!updatedUser2) new NextResponse("Error while upding user model", {status : 400})
  
      return NextResponse.json(deleteFriendRequest);
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status : 500 });
  }
}