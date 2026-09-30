"use client";

import { useRouter } from "next/navigation";
import AuthPanel from "@/components/auth/AuthPanel";

export default function AccountAuthGate() {
  const router = useRouter();

  return <AuthPanel onAuthenticated={() => router.refresh()} />;
}