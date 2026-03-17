"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  Activity,
  History,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

type SidebarItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const sections: SidebarSection[] = [
  {
    title: "Menu",
    items: [
      { name: "Projects", href: "/project", icon: FolderKanban },
      { name: "Monitors", href: "/monitor", icon: Activity },
      {
        name: "Monitoring History",
        href: "/monitoring-history",
        icon: History,
      },
    ],
  },
  // Example for later:
  // {
  //   title: "Others",
  //   items: [
  //     { name: "Settings", href: "/settings", icon: Settings },
  //   ],
  // },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-gray-200 bg-white px-4 py-5 dark:border-gray-800 dark:bg-gray-900">
      {/* Logo */}
      <div className="mb-8 px-2">
        <Link href="/" className="block w-full max-w-[180px]">
          <Image
            src="/icons/logo.png"
            alt="Logo"
            width={400}
            height={120}
            className="h-auto w-full object-contain"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <span>{section.title}</span>
              </h2>

              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 shrink-0 ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Logged in as
            </p>
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
              {session?.user?.name ?? "User"}
            </p>
          </div>

          <LogoutButton />
          {/* <button onClick={() => signOut()}> */}
          {/* <LogOut className="h-4 w-4" /> */}
          {/* Logout */}
          {/* </button> */}
        </div>
      </div>
    </aside>
  );
}
