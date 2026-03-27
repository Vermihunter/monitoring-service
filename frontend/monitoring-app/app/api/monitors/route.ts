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

export async function POST(request: Request) {
  const body = await request.json();
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  let endpoint;
  if (body.type === "PingMonitor") {
    endpoint = "pingmonitor";
  } else if (body.type === "WebsiteMonitor") {
    endpoint = "websitemonitor";
  } else {
    throw new Error("Invalid monitor type");
  }

  const { projects, ...others } = body;
  console.log("sending monitor");
  console.log(others);

  const res = await fetch(
    `${process.env.BACKEND_URL}/api/v1/monitors/${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt}`,
      },
      method: "POST",
      body: JSON.stringify(others),
    },
  );

  console.log(await res.json());
  return Response.json({});
}
