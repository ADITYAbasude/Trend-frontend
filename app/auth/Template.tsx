"use client";
import { Logo } from "@/components";
import { Metadata } from "next";
import React from "react";

function Template({ children }: { children: React.ReactNode }) {
  const metadata: Metadata ={
    title: 'Trend login'
  }
  return (
    <div className="flex w-full">
      <div
        style={{
          backgroundImage:
            "linear-gradient( 90.21deg,rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)) , url('/images/auth-background.png')",
        }}
        className="h-[100vh] w-[50%] bg-no-repeat bg-cover bg-center
         bg-[url('/images/auth-background.png')] bg-opacity-40 flex justify-center items-center
         max-lg:relative max-lg:max-h-[75%] max-lg:w-[100%] fixed"
      >
        <div className="opacity-100 text-5xl max-lg:text-4xl mx-5 font-serif max-md:hidden">
          <span>&apos;Make the world happy by shearing the memes.&apos;</span>
          <div className="flex text-2xl float-right">
            ---- by &nbsp; <Logo />
          </div>
        </div>
      </div>
      <div
        className="flex justify-center items-center w-[50%] max-lg:absolute max-lg:left-[50%]
      max-lg:top-[100%] max-lg:transform max-lg:translate-x-[-50%] max-lg:translate-y-[-50%] max-lg:flex max-lg:justify-center
      max-lg:items-center max-lg:w-[50%] max-lg:max-lg:absolute max-lg:max-lg:left-[50%] max-lg:right-[50%]
      max-md:translate-y-[-80%] max-sm:translate-x-[-0%] max-sm:left-0 max-sm:right-0 max-sm:w-auto max-sm:p-5 absolute right-0 top-0 bottom-0 my-4"
      >
        <div
          className={`flex relative flex-col justify-center items-center rounded-md w-[350px] 
          backdrop-blur transition-colors backdrop-opacity-50 p-5 gap-4 bg-slate-100 dark:bg-gray-900/75 select-none`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Template;
