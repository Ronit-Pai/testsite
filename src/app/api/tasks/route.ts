import { NextResponse } from "next/server";
import { getFaultMode, tasks } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const mode = getFaultMode();

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
  if (!status) {
    return NextResponse.json(
      { ok: false, error: "Task service failed while listing tasks." },
      { status: 500 }
    );
  }

  const selected = tasks.filter((task) => task.status === status.toLowerCase());
  return NextResponse.json({
    ok: true,
    count: selected.length,
    tasks: selected,
    timestamp: new Date().toISOString()
  });
}
