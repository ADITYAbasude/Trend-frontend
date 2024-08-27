"use client";

import { Logo } from "@/components";
import { useAuthStore } from "@/stores/auth.store";
import { getToken } from "@/utils/utils";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Splash = () => {
  const [token, setToken] = useState<string | undefined>(undefined);

  const { valid } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    getToken()
      .then((res: any) => setToken(res))
      .catch((err) => console.log(err));
  }, []);

  //* token verification
  useEffect(() => {
    if (token !== undefined) {
      useAuthStore
        .getState()
        .verifyUser()
        .then(() => {
          if (valid) router.push("/home");
        })
        .catch((err) => console.log(err));
    } else {
      if (token === undefined) {
        router.push("/auth/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, valid]);

  // useEffect(() => {
  //   if (token === undefined) router.push("/auth/login");
  // }, [token, router]);

  const metadata: Metadata = {
    title: "Trend",
    description: "welcome to trend",
  };

  return (
    <main className=" flex justify-center items-center h-[100vh]">
      <Logo />
    </main>
  );
};

export default Splash;
