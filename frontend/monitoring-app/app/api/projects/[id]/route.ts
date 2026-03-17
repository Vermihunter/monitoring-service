import { cookies } from "next/headers";

/**
 *
 * @param request
 * @param param1
 * @returns
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  console.log("Projects GET ID request Proxy", jwt, " --- ", id);
  console.log(`${process.env.BACKEND_URL}/api/v1/projects/${id}`);
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/projects/${id}`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
  });

  const data = await res.json();
  console.log(data);

  return Response.json(data.data.data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  console.log("Sending modified project");
  console.log(body);

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/projects/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return Response.json(data, { status: res.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("Projects GET ID request Proxy");

  const { id } = await params;
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/projects/${id}`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
    method: "DELETE",
  });

  const data = await res.json();
  console.log(data);

  return Response.json(data.data.data);
}
