import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "andhra-pradesh-live",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    liveSourcesConfigured: false,
    note: "No live source monitoring is claimed until source connectors are configured."
  });
}