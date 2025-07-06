"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // デフォルトでダッシュボードにリダイレクト
    router.push("/dashboard");
  }, [router]);

  return null; // リダイレクト中は何も表示しない
}
