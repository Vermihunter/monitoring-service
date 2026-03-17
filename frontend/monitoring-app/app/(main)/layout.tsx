//import "@/app/globals.css";

import Layout from "@/app/_components/Layout";
import { Providers } from "../providers";
import { Toaster } from "sonner";
import ProtectedRoute from "../_components/ProtectedRoute";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Providers>
        <Layout>{children}</Layout>
        <Toaster richColors position="top-center" />
      </Providers>
    </ProtectedRoute>
  );
}
