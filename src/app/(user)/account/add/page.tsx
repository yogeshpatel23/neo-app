import AddAccountForm from "@/components/account/AddAccountForm";

export default function AddAccountPage() {
  return (
    <div className="max-w-96 m-auto border-2 p-4 rounded-lg mt-4">
      <h2 className="text-2xl text-center">Add Account</h2>
      <AddAccountForm />
    </div>
  );
}
