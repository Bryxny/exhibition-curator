"use client";

import CollectionModal from "./CollectionModal";
import UserModal from "./UserModal";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="relative flex items-center py-2 px-3 bg-zinc-800 border-b-2 border-yellow">
      <div className="flex-1 flex items-center text-white">
        <UserModal />
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img
          src="/Logo.png"
          alt="Logo"
          className="w-40 h-auto cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      <div className="flex-1 flex justify-end items-center">
        <CollectionModal />
      </div>
    </header>
  );
}
