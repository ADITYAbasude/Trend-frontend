"use client";

import { Button, Divider, Input } from "@nextui-org/react";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import { PiEyeBold, PiEyeClosedDuotone } from "react-icons/pi";
import { Loading, Logo } from "@/components";
import { useAuthStore } from "@/stores/auth.store";
import Template from "../Template";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/utils";

const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

function Login() {
  const [userData, setUserData] = useState({
    mailId: "",
    password: "",
  });

  const [visible, setVisible] = useState(false);

  const { successful, loading, message, valid } = useAuthStore(
    (state) => state
  );
  const router = useRouter();

  // Handle both initial auth check and login success
  useEffect(() => {
    const handleAuth = async () => {
      try {
        if (successful) {
          // Wait for token to be set after successful login
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push("/home");
          return;
        }

        const existingToken = await getToken();
        if (existingToken) {
          await useAuthStore.getState().verifyUser();
          if (valid) {
            router.push("/home");
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    };

    handleAuth();
  }, [successful, valid, router]);

  const toggleVisibility = () => setVisible(!visible);
  return (
    <Template>
      <metadata {...metadata} />
      <Logo />
      <Divider />
      <h3 className="text-xl font-sans text-black dark:text-white">
        Login to your account
      </h3>
      {!successful && message.length != 0 ? (
        <div
          className="bg-primary/20 w-full p-3 relative text-black dark:text-white"
          role="alert"
        >
          <p>{message}</p>
        </div>
      ) : (
        ""
      )}

      <Input
        className="text-black dark:text-white"
        type="email"
        variant="bordered"
        size="md"
        radius="sm"
        name="mailId"
        placeholder="Enter email address"
        onValueChange={(value) => setUserData({ ...userData, mailId: value })}
      />
      <Input
        className="text-black dark:text-white"
        type={visible ? "text" : "password"}
        radius="sm"
        variant="bordered"
        size="md"
        placeholder="Enter password"
        maxLength={10}
        endContent={
          <Button
            className=" outline-none text-[1.2rem] text-default-700 bg-transparent"
            type="button"
            radius="full"
            isIconOnly
            onClick={toggleVisibility}
          >
            {visible ? <PiEyeBold /> : <PiEyeClosedDuotone />}
          </Button>
        }
        onValueChange={(value) => setUserData({ ...userData, password: value })}
      />

      <Button
        className="w-full mt-10 mb-2"
        color="primary"
        variant="shadow"
        radius="sm"
        onClick={(_) => {
          useAuthStore.getState().login(userData.mailId, userData.password);
        }}
      >
        Login
      </Button>

      <div className="flex justify-center mt-5">
        <p className="text-black dark:text-white">
          Don&apos;t have an account?{" "}
          <a className="text-primary" href="/auth/register">
            Sign Up
          </a>
        </p>
      </div>

      {!loading || <Loading />}
    </Template>
  );
}

export default Login;
