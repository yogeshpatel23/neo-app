import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }
  // const accounts = await getAccounts();
  return (
    <main className="flex justify-center p-2 md:p-4">
      <h1>Welcome {session.user.name}</h1>
    </main>
  );
}
