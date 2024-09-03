import Link from "next/link";

import { Button } from "@/components/ui/button";

function Home() {
  return (
    <>
      <h1 className="text-3xl font-semibold mb-4">Fully featured Auth Demo</h1>
      <Button asChild>
        <Link href="/main">Get started</Link>
      </Button>
    </>
  );
}

export default Home;
