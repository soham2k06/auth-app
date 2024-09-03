import { redirect } from "next/navigation";

import { getSession } from "@/lib/actions/auth";

async function AuthLayout({ children }: React.PropsWithChildren) {
  const session = await getSession();
  if (session) redirect("/main");

  return (
    <main className="min-h-screen flex justify-center items-center">
      {children}
    </main>
  );
}

export default AuthLayout;
