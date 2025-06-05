import mongoose, { Document, Model, Schema } from "mongoose";

//user object fields
export interface IUser extends Document {
  fullName: string,
  email: string,
  password: string,
  profilePic: string
}

//user schema
const userSchema: Schema<IUser> = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profilePic: {
    type: String,
    default: "",
  }
}, { timestamps: true })

//user model
export const User: Model<IUser> = mongoose.model<IUser>("user", userSchema);