import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen grid-cols-[250px_1fr] grid-rows-[64px_1fr]">
      {/* Sidebar */}
      <div className="row-span-2">
        <Sidebar />
      </div>

      {/* Topbar */}
      <div className="border-b">
        <Topbar />
      </div>

      {/* Main Content */}
      <main className="p-6 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
