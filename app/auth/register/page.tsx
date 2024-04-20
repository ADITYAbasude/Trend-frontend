"use client";

import { Loading, Logo } from "@/components";
import { useAuthStore } from "@/stores/auth.store";
import { Button, Divider, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { PiEyeBold, PiEyeClosedDuotone } from "react-icons/pi";
import Template from "../Template";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/utils";
import OtpInput from "react-otp-input";
import { FaGoogle } from "react-icons/fa6";
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    mailId: "",
    fullName: "",
    username: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  // const [handle]
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const { loading, successful, message, valid, otpSend } = useAuthStore(
    (state) => state
  );
  const router = useRouter();

  useEffect(() => {
    if (successful) {
      router.push("/");
    }
  }, [successful, router]);

  {
    /*
     *if user already has a token then verify that token is valid or not
     *if valid then redirect to home page
     */
  }
  const tokenValue = getToken();
  const token: any =
    typeof tokenValue === "string"
      ? (tokenValue as string).split(" ")[1]
      : null;
  useEffect(() => {
    if (
      token !== "undefined" &&
      token !== undefined &&
      token !== null &&
      token !== ""
    ) {
      useAuthStore.getState().verifyUser();
    }
  }, [token]);

  useEffect(() => {
    if (valid) {
      router.push("/");
    }
  }, [valid, router]);

  return (
    <>
      <Template>
        <Logo />
        <Divider />
        <h3 className="text-xl font-sans text-black dark:text-white">
          Create your account
        </h3>
        {!successful && message?.length != 0 ? (
          <div
            className="bg-primary/20 w-full p-3 relative text-black dark:text-white"
            role="alert"
          >
            {message}
          </div>
        ) : (
          ""
        )}
        <Input
          className="text-black dark:text-white"
          type="text"
          radius="sm"
          variant="bordered"
          size="md"
          placeholder="Enter full name"
          name="fullName"
          maxLength={15}
          onValueChange={(value) =>
            setRegisterData({ ...registerData, fullName: value })
          }
        />
        <Input
          className="text-black dark:text-white"
          type="text"
          radius="sm"
          variant="bordered"
          size="md"
          placeholder="Enter username"
          name="username"
          maxLength={12}
          onValueChange={(value) =>
            setRegisterData({ ...registerData, username: value })
          }
        />

        <Input
          className="text-black dark:text-white"
          radius="sm"
          type="email"
          variant="bordered"
          size="md"
          placeholder="Enter mail id"
          name="mailId"
          onValueChange={(value) =>
            setRegisterData({ ...registerData, mailId: value })
          }
        />
        <Input
          className="text-black dark:text-white"
          type={visible ? "text" : "password"}
          radius="sm"
          variant="bordered"
          size="md"
          placeholder="Create password"
          name="password"
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
          onValueChange={(value) =>
            setRegisterData({ ...registerData, password: value })
          }
        />
        {useAuthStore.getState().otpSend && (
          <div className="w-full flex-col justify-center items-center">
            <p className="text-black dark:text-white">Verify OTP</p>
            <OtpInput
              value={otp}
              onChange={(e) => {
                setOtp(e);
              }}
              numInputs={4}
              renderSeparator={<span className=" mx-2">-</span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={
                "w-14 h-14 m-2 text-2xl text-center border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500 text-black dark:text-white select-none"
              }
            />
          </div>
        )}
        <Button
          className="w-full mt-10 mb-1"
          color="primary"
          variant="shadow"
          radius="sm"
          onClick={() => {
            if (otpSend) {
              useAuthStore.getState().verifyOtp(otp, registerData.mailId);
              return;
            }
            useAuthStore
              .getState()
              .register(
                registerData.mailId,
                registerData.fullName,
                registerData.username,
                registerData.password
              );
          }}
        >
          {otpSend ? "Verify" : "Sign Up"}
        </Button>

        <div className="flex justify-center mt-5">
          <p className="text-black dark:text-white">
            Already have an account?{" "}
            <a className="text-primary" href="/auth/login">
              Login
            </a>
          </p>
        </div>

        {!loading || <Loading />}
      </Template>
    </>
  );
};

export default Register;
