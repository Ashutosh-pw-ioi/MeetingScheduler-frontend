"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Select Your Role</h1>
      <button
        onClick={() => router.push("/interviewee")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      >
        Interviewee
      </button>
      <button
        onClick={() => router.push("/auth/login/interviewer")}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
      >
        Interviewer
      </button>
      <button
        onClick={() => router.push("/admin")}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
      >
        Admin
      </button>
    </div>
  );
}
