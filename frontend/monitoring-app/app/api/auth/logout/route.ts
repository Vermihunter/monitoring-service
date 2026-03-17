import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  console.log("Deleting jwt:", cookieStore.get("jwt"));
  cookieStore.delete("jwt"); // or 'session'

  return NextResponse.json({ ok: true });
}
