import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ItemForm } from "@/components/item-form";

export default async function NewItemPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            List a New Item
          </h1>
          <p className="mt-1 text-muted-foreground">
            Share something with your community
          </p>
        </div>

        <ItemForm />
      </div>
    </div>
  );
}
