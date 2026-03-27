import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  console.log(`${process.env.BACKEND_URL}/api/v1/monitors/${id}`);
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/monitors/${id}`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
  });

  const data = await res.json();

  return Response.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("Sending modified monitor");
  const { id } = await params;
  const body = await request.json();
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  console.log(body);

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/monitors/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.text();
  console.log("Response");
  console.log(data);

  return Response.json(data, { status: res.status });
}
