import { type Document, model, models, Schema } from "mongoose";

import { IUser } from "@/types/auth";

type UserDocument = IUser & Document;

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    role: {
      type: String,
      enum: ["Owner", "Staff"],
    },
    // organizations: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Organization",
    //   },
    // ],
    // activeOrganization: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Organization",
    // },
  },
  { timestamps: true }
);

const UserModel = models?.User || model("User", userSchema);

export default UserModel;
