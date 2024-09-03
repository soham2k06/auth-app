"use client";

import React from "react";

import { redirect } from "next/navigation";

import { getSession } from "@/lib/actions/auth";
import { ISession } from "@/types/auth";

interface ReturnType {
  session: ISession | null;
  loading: boolean;
}

export function useSession(deps: React.DependencyList = []): ReturnType {
  const [loading, setLoading] = React.useState(true);
  const [session, setSession] = React.useState<ISession | null>(null);

  React.useEffect(() => {
    (async function () {
      const session = await getSession();
      setSession(session);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  if (!loading && !session) return redirect("/login");

  return { session, loading };
}
