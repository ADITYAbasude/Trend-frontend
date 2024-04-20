"use client";

import { Logo } from "@/components";
import { useAuthStore } from "@/stores/auth.store";
import { getToken, getUserId } from "@/utils/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Splash = () => {
  const [token, setToken] = useState<String>();
  const [userId, setUserId] = useState<String>();

  const { valid } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    getToken().then((res) => setToken(res));
    getUserId().then((res) => setUserId(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //* token verification
  useEffect(() => {
    if (token !== undefined && window !== undefined) {
      useAuthStore.getState().verifyUser();
      if (valid) router.push("/home");
    } else {
      router.push("/auth/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, valid]);

  return (
    <main className=" flex justify-center items-center h-[100vh]">
      <Logo />
    </main>
  );
};

export default Splash;
