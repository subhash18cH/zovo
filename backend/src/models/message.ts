import mongoose, { Document, Model, Schema } from "mongoose";

//Message object fields -todo-make coorections here
export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId,
  receiverId: mongoose.Types.ObjectId,
  text: string,
  image: string,
}

//Message schema
const messageSchema: Schema<IMessage> = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  }
}, { timestamps: true })

//Message model
export const Message: Model<IMessage> = mongoose.model<IMessage>("message", messageSchema);