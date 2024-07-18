import { getAccount } from "@/app/action";
import AccountCard from "@/components/account/AccountCard";
import { Button } from "@/components/ui/button";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }
  const account = await getAccount();
  console.log(account);
  if (!account) redirect("/account/add");
  return (
    <main className="flex flex-col justify-center p-2 md:p-4">
      <div className="container">
        <h1>Welcome {session.user.name}</h1>
        <AccountCard account={account} />
      </div>
    </main>
  );
}
