import { auth } from "@/lib/auth";
import { generateMockListing } from "@/lib/ai-mocks/photo-listing";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Artificial delay to simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const listing = generateMockListing();

  return Response.json(listing);
}
