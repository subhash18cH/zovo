import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string,
  email: string,
  password: string,
  profilePic: string
}

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

export const User: Model<IUser> = mongoose.model<IUser>("user", userSchema);