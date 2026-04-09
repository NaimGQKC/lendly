import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/components/item-form";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
  });

  if (!item) {
    redirect("/catalog");
  }

  const role = (session.user as Record<string, unknown>).role as string;
  if (item.ownerId !== session.user.id && role !== "ADMIN") {
    redirect("/catalog");
  }

  const initialData = {
    name: item.name,
    description: item.description,
    category: item.category,
    condition: item.condition,
    replacementValue: String(item.replacementValue),
    depositAmount: String(item.depositAmount),
    maxLoanDays: String(item.maxLoanDays),
    imageUrl: item.imageUrl || "",
    careInstructions: item.careInstructions || "",
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Edit Listing
          </h1>
          <p className="mt-1 text-muted-foreground">
            Update the details for {item.name}
          </p>
        </div>

        <ItemForm initialData={initialData} itemId={item.id} />
      </div>
    </div>
  );
}
