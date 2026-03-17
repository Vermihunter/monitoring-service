import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const c = await cookies();
  const jwt = c.get("jwt")?.value;
  //console.log(`${process.env.BACKEND_URL}/api/v1/monitors/${id}/activate`);
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/v1/monitors/${id}/activate`,
    {
      headers: {
        Cookie: `jwt=${jwt}`,
      },
      method: "POST",
    },
  );

  return Response.json(await res.json());
}
