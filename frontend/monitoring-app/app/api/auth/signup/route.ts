export async function POST(request: Request) {
  const body = await request.json();
  // console.log("Auth Signup POST request Proxy: ", JSON.stringify(body));

  const { fname, lname, email, password, passwordConfirm } = body;

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/signup`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name: `${fname} ${lname}`,
      email,
      password,
      passwordConfirm,
    }),
  });

  //return Response.json({});
  return Response.json(await res.json());
}
