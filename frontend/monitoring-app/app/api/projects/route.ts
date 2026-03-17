import { cookies } from "next/headers";

export async function GET() {
  console.log("Projects GET request Proxy");
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/projects/`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
  });

  const data = await res.json();

  return Response.json(data.data.data);
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log("Projects POST request Proxy: ", JSON.stringify(body));

  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/projects/`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`,
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  return Response.json(await res.json());
}
