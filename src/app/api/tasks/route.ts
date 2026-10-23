import { NextResponse } from "next/server";
import { getFaultMode, tasks } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const mode = getFaultMode();

  // These faults are deliberately controlled by a server-side environment
  // variable; no public URL parameter can trigger a failure.
  if (mode === "runtime" || mode === "persistent") {
    return NextResponse.json(
      {
        ok: false,
        error: mode === "runtime"
          ? "Demo runtime regression: task service unavailable"
          : "Demo persistent defect: task query failed",
        mode
      },
      { status: 500 }
    );
  }

  const status = new URL(request.url).searchParams.get("status");
  const filteredTasks = status ? tasks.filter((task) => task.status === status) : tasks;

  return NextResponse.json({
    ok: true,
    count: filteredTasks.length,
    tasks: filteredTasks,
    timestamp: new Date().toISOString()
  });
}
