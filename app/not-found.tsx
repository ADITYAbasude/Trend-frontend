// pages/404.tsx
import { NextPage } from "next";
import Link from "next/link";
const Custom404: NextPage = () => {
  return (
    <div className="items-center p-[20px] text-[#666] dark:text-white">
      <h1 className="text-[2em] text-[#333] dark:text-white">404 - Page Not Found</h1>
      <p>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <p>
        You will be redirected to the homepage in 5 seconds. If not, click{" "}
        <Link href="/">here</Link>.
      </p>
    </div>
  );
};

export default Custom404;
