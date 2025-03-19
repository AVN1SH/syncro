import mongoose from "mongoose";

const TempDataSchema = new mongoose.Schema({
    key: { type: String, required: true },
    type: { type : String, required : true},
    value: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }
});

export const TempData = mongoose.models.TempData || mongoose.model("TempData", TempDataSchema);
