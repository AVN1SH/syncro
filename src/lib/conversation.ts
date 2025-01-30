import ConversationModel from "@/model/conversation.model";
import dbConnect from "./dbConnect"
import mongoose from "mongoose";
import { ConversationWithMembersWithUsers } from "@/types";

export const getOrCreateConversation = async (
  memberOneId : string,
  memberTwoId : string
) => {
  let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

  if(!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }
  return conversation;
}

const findConversation = async (
  memberOneId : string,
  memberTwoId : string
) => {
  try {
    await dbConnect();
  
    const conversation : ConversationWithMembersWithUsers[] =  await ConversationModel.aggregate([
      {
        $match: {
          $and: [
            { memberOne: new mongoose.Types.ObjectId(memberOneId) },
            { memberTwo: new mongoose.Types.ObjectId(memberTwoId) }
          ]
        }
      },
      {
        $lookup: {
          from: 'members',
          localField: 'memberOne',
          foreignField: '_id',
          as: 'memberOne'
        }
      },
      {
        $lookup: {
          from: 'members',
          localField: 'memberTwo',
          foreignField: '_id',
          as: 'memberTwo'
        }
      },
      {
        $unwind: '$memberOne'
      },
      {
        $unwind: '$memberTwo'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'memberOne.user',
          foreignField: '_id',
          as: 'memberOne.user'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'memberTwo.user',
          foreignField: '_id',
          as: 'memberTwo.user'
        }
      },
      {
        $unwind: '$memberOne.user'
      },
      {
        $unwind: '$memberTwo.user'
      },
      {
        $match: {
          'memberOne.user': { $exists: true },
          'memberTwo.user': { $exists: true }
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
  memberOneId : string,
  memberTwoId : string
) => {
  try {
    await dbConnect();
    const newConversation = await ConversationModel.create({
      memberOne: memberOneId,
      memberTwo: memberTwoId
    });

    if(!newConversation) return null;
    
    const populatedConversation = await ConversationModel.findById(newConversation._id)
    .populate({
      path: 'memberOne',
      populate: {
        path: 'user'
      }
    })
    .populate({
      path: 'memberTwo',
      populate: {
        path: 'user'
      }
    }).lean() as ConversationWithMembersWithUsers;

    if(!populatedConversation.memberOne.user || !populatedConversation.memberTwo.user) return null;

    return populatedConversation;

  } catch (error) {
    console.log(error);
    return null;
  }
}