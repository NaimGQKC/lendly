import { auth } from "@/lib/auth";
import { generateConditionReport } from "@/lib/ai-mocks/condition-report";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { condition } = body;

  if (!condition || typeof condition !== "string") {
    return Response.json({ error: "condition is required" }, { status: 400 });
  }

  // Artificial delay to simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const report = generateConditionReport(condition);

  return Response.json(report);
}
