"use client";

import React from "react";
import { Navbar, NavbarContent, NavbarBrand } from "@nextui-org/react";
import { useThemeStore } from "@/stores/theme.store";
import { useTheme } from "next-themes";
import { Logo } from "@/components";
import Link from "next/link";
const Header = () => {
  // const [theme, setTheme] = useThemeStore((state) => [
  //   state.theme,
  //   state.setTheme,
  // ]);

  const { theme, setTheme } = useTheme();

  return (
    <>
      <Navbar
        className={`top-0 z-40 w-full backdrop-blur fixed flex-none transition-colors supports-backdrop-blur:bg-white/95 duration-500 bg-slate-100/75 dark:bg-gray-900/75 `}
        maxWidth="full"
        position="sticky"
      >
        <Link href="/">
          <NavbarBrand className="cursor-pointer">
            <Logo />
          </NavbarBrand>
        </Link>
        <NavbarContent justify="end"></NavbarContent>
      </Navbar>
    </>
  );
};

export default Header;

{
  /* <NavbarItem isActive>
            <Link href={"/login"}>
              <Button
                variant="solid"
                className="data-[active=true]:after:bg-primary text-primary-foreground"
                color="primary"
              >
                Login
              </Button>
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href={"/register"}>
              <Button
                variant="solid"
                className="data-[active=true]:after:bg-primary-100 "
                color="primary"
              >
                Register
              </Button>
            </Link>
          </NavbarItem> */
}
