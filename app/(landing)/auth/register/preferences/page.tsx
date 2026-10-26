import { CreateUserForm } from "@/components/forms/create-user-form";
import { getCurrencies } from "@/lib/currencies";

export default async function Page() {
  const currencies = await getCurrencies();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CreateUserForm currencies={currencies} />
      </div>
    </div>
  );
}
