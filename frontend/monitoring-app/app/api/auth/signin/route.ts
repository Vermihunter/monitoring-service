import { SignInData } from "@/app/_types/SignInData";

export async function POST(request: Request) {
  const body = await request.json();
  // console.log("Auth Signup POST request Proxy: ", JSON.stringify(body));

  const data: SignInData = body;

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  //return Response.json({});
  return Response.json(await res.json());
}
