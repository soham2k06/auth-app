import { type Document, model, models, Schema } from "mongoose";

import { IOrganization } from "@/types/auth";

type OrganizationDocument = IOrganization & Document;

const organizationSchema = new Schema<OrganizationDocument>(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: true,
    },

    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const OrganizationModel =
  models.Organization || model("Organization", organizationSchema);

export default OrganizationModel;
