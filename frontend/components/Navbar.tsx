"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-xl font-bold">Inventory</h1>

      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}