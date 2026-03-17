import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `${BACKEND_URL}/graphql`,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
