"use client";

import { Spinner } from "@nextui-org/react";

export const Loading = () => {
  return (
    <div className="absolute flex justify-center items-center h-full w-full">
      <Spinner color="primary" />
    </div>
  );
};
