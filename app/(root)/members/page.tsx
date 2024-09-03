import { getSession } from "@/lib/actions/auth";
import dbConnect from "@/lib/dbConnect";
import OrganizationModel from "@/models/organization";
import UserModel from "@/models/user";
import { IOrganization } from "@/types/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RemoveMember } from "./_components";

async function MembersPage() {
  await dbConnect();

  const session = await getSession();

  const organization: IOrganization | null = await OrganizationModel.findById(
    session?.user.organization
  ).populate({ model: UserModel, path: "members" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of all organization members.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Full name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organization?.members.map((member) => (
              <TableRow key={String(member._id)}>
                <TableCell className="whitespace-nowrap">
                  {member.firstname} {member.lastname}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <RemoveMember
                  memberId={String(member._id)}
                  orgId={String(organization._id)}
                  isCreator={
                    String(organization.creator) === String(member._id)
                  }
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default MembersPage;
