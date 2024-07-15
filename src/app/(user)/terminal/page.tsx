import { getAccount } from "@/app/action";
import StoreProvider from "@/components/StoreProvider";
import Terminal from "@/components/terminal/Terminal";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function TermialPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }
  const account = await getAccount();
  if (!account) {
    redirect("/dashboard");
  }
  if (
    !(
      account.accessToken != "" &&
      account.tokenExp === new Date().toDateString()
    )
  )
    redirect("/dashboard");
  return (
    <StoreProvider>
      <Terminal account={account} />
    </StoreProvider>
  );
}
