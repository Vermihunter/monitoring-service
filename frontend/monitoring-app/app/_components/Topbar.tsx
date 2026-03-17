"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { ThemeToggleButton } from "./ThemeToggleButton";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="h-full flex items-center justify-between px-6 bg-white">
      <div className="font-semibold text-lg">Dashboard</div>

      <div className="flex items-center gap-4">
        <ThemeToggleButton />
        {/* <button className="text-gray-600 hover:text-black">🔔</button> */}
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 bg-gray-300 rounded-full">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </div>
          <span className="text-sm font-medium">{session?.user?.name}</span>
        </div>
      </div>
    </header>
  );
}
