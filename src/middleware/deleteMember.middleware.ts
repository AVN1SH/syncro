import ConnectionModel from "@/model/connection.model";
import { Member } from "@/model/member.model";
import { Schema } from "mongoose";

export const deleteMemeberMiddleware = (memberSchema : Schema<Member>) => {
  memberSchema.pre("findOneAndDelete", async function(next) {
    const member = await this.model.findOne(this.getFilter());

    if(member) {
      await ConnectionModel.updateMany({
        members : member._id
      }, {
        $pull : { members : member._id}
      })
    }

    next();
  })
}