import { ObjectId } from "mongoose";

type RoleName = "Owner" | "Staff";

// interface IRole {
//   _id: ObjectId;
//   orgId: ObjectId;
//   name: RoleName;
//   permissions?: string[];
// }

interface IOrganization {
  _id: ObjectId;
  creator: ObjectId; // Owner
  name: string;
  members: IUser[];
  // invitedMembers: {
  //   email: string;
  //   role: IRole["_id"];
  // }[];
  // ownerRole: IRole;
  // roles: IRole[];
}

interface IUser {
  _id: ObjectId;
  email: string;
  firstname: string;
  lastname: string;
  hashedPassword: string;
  organization: IOrganization["_id"];
  // organizations: IOrganization[];
  // activeOrganization?: IOrganization["_id"];
  // role?: IRole["_id"];
  role: RoleName;
}

interface ISession {
  user: IUser;
  iat: number;
  exp: number;
}

interface IInviteLinkSession {
  organization: string;
  role: RoleName;
  iat: number;
  exp: number;
}

export type { IUser, IOrganization, ISession, RoleName, IInviteLinkSession };
