"use client";

import { Logo } from "@/components";
import { useAuthStore } from "@/stores/auth.store";
import { getToken } from "@/utils/utils";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Splash = () => {
  const { valid } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.push("/auth/login");
          return;
        }
        
        await useAuthStore.getState().verifyUser();
        if (valid) {
          router.push("/home");
        } else {
          router.push("/auth/login");
        }
      } catch (err) {
        console.error("Auth error:", err);
        router.push("/auth/login");
      }
    };

    initAuth();
  }, [router, valid]);

  return (
    <main className="flex justify-center items-center h-[100vh]">
      <Logo />
    </main>
  );
};

export default Splash;
