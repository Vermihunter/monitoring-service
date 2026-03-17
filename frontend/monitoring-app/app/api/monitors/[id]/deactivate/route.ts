import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  const res = await fetch(
    `${process.env.BACKEND_URL}/api/v1/monitors/${id}/deactivate`,
    {
      headers: {
        Cookie: `jwt=${jwt}`,
      },
      method: "POST",
    },
  );

  const data = await res.text();
  console.log(data);
  return Response.json({});
}
