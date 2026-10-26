"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function SchoolRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  useEffect(() => {
    router.replace(`/school/dashboard?userId=${userId}`);
  }, [router, userId]);
  return null;
}
