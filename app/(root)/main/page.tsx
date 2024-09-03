"use client";

import React from "react";

import Link from "next/link";

import { useSession } from "@/hooks/use-session";
import { logout } from "@/lib/actions/auth";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateOrganizationDialog, GetInviteLinkDialog } from "./_components";

function MainPage() {
  // using custom success to re-run the useEffect
  const [success, setSuccess] = React.useState(false);

  const { session, loading } = useSession([success]);

  return (
    <div>
      {loading ? (
        <Skeleton className="max-w-sm h-8" />
      ) : (
        <>
          <h1>{session?.user.firstname}</h1>
          <div className="flex gap-2">
            <Button onClick={() => logout()}>Logout</Button>
            {!session?.user.organization ? (
              <CreateOrganizationDialog setSuccess={setSuccess} />
            ) : (
              <>
                {session.user.role === "Owner" && (
                  <>
                    <GetInviteLinkDialog />
                    <Button asChild>
                      <Link href="/members">Members</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MainPage;
