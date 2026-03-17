import { cookies } from "next/headers";

export async function GET() {
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  console.log("fetching");
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/monitors/`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
  });

  const data = await res.json();

  return Response.json(data);
}
