import dbConnect from "./dbConnect"
import mongoose from "mongoose";
import { FriendConversationsWithUsers } from "@/types";
import FriendConversationModel from "@/model/friendConversation.model";

export const getOrCreateConversation = async (
  userOneId : string,
  userTwoId : string
) => {
  let conversation = await findConversation(userOneId, userTwoId) || await findConversation(userTwoId, userOneId);

  if(!conversation) {
    conversation = await createNewConversation(userOneId, userTwoId);
  }
  return conversation;
}

const findConversation = async (
  userOneId : string,
  userTwoId : string
) => {
  try {
    await dbConnect();

    const conversation : FriendConversationsWithUsers[] = await FriendConversationModel.aggregate([
      {
        $match: {
          $and: [
            { userOne: new mongoose.Types.ObjectId(userOneId) },
            { userTwo: new mongoose.Types.ObjectId(userTwoId) }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userOne',
          foreignField: '_id',
          as: 'userOne'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userTwo',
          foreignField: '_id',
          as: 'userTwo'
        }
      },
      {
        $unwind: '$userOne'
      },
      {
        $unwind: '$userTwo'
      },
      {
        $match: {
          'userOne': { $exists: true },
          'userTwo': { $exists: true }
        }
      }
    ]).exec();

    if(!conversation.length) return null
  
    return conversation[0];
  } catch (error) {
    console.log(error);
    return null
  }
}

const createNewConversation = async (
  userOneId : string,
  userTwoId : string
  ) => {
  try {
    await dbConnect();
    const newConversation = await FriendConversationModel.create({
      userOne: new mongoose.Types.ObjectId(userOneId),
      userTwo: new mongoose.Types.ObjectId(userTwoId)
    });

    if(!newConversation) return null;
    
    const populatedConversation = await FriendConversationModel.findById(newConversation._id)
    .populate(["userOne", "userTwo"]).lean() as FriendConversationsWithUsers;

    if(!populatedConversation.userOne || !populatedConversation.userTwo) return null;

    return populatedConversation;

  } catch (error) {
    console.log(error);
    return null;
  }
}