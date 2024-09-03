"use client";

import React from "react";

import { removeMember } from "@/lib/actions/organization";

import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";

interface Props {
  memberId: string;
  orgId: string;
  isCreator: boolean;
}

function RemoveMember({ memberId, orgId, isCreator }: Props) {
  const [removingMember, setRemovingMember] = React.useState<string | null>(
    null
  );

  async function handleRemove() {
    setRemovingMember(memberId);
    await removeMember(memberId, orgId);
    setRemovingMember(null);
  }

  if (isCreator) return;

  return (
    <>
      <TableCell>
        <Button
          variant="destructive"
          onClick={handleRemove}
          loading={removingMember === memberId}
          className="min-w-32"
        >
          Remove
        </Button>
      </TableCell>
    </>
  );
}

export default RemoveMember;
