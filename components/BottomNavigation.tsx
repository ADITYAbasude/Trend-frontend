"use client";
import { MoonIcon } from "@/assets/svg/moon";
import { SunIcon } from "@/assets/svg/sun";
import useUser from "@/hooks/useUser.hook";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Switch,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { PiHouseFill, PiMagnifyingGlass, PiTrendUpFill } from "react-icons/pi";
import SearchModal from "./SearchModal";

const BottomNavigation = () => {
  const { data } = useUser();
  const { theme, setTheme } = useTheme();

  const searchModal = useDisclosure();

  return (
    <div
      className="fixed bottom-0 w-full z-10 flex justify-around items-center h-16 bg-slate-100
     dark:bg-black border-t border-gray-100/20 text-black dark:text-white md:hidden"
    >
      <Link href="/home">
        <PiHouseFill size={24} />
      </Link>
      <div onClick={searchModal.onOpen}>
        <PiMagnifyingGlass size={24} />
      </div>
      <Link href="/trending">
        <PiTrendUpFill size={24} />
      </Link>
      <Dropdown radius="sm" itemProp="text-primary">
        <DropdownTrigger>
          <Avatar src={data?.getUser?.profile_picture ?? "/images/user.png"} />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="custom item style"
          className="p-2"
          itemClasses={{
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "data-[hover=true]:bg-default-100",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          }}
        >
          <DropdownSection aria-label="Profile" showDivider>
            <DropdownItem
              key="profile"
              className="opacity-100"
              href={`/channel/${data?.getUser?.username}`}
            >
              <User
                name={`${data?.getUser?.full_name}`}
                description={`@${data?.getUser?.username}`}
                classNames={{
                  description: "text-default-500",
                }}
                avatarProps={{
                  size: "lg",
                  src: data?.getUser?.profile_picture ?? "/images/user.png",
                }}
              />
            </DropdownItem>
          </DropdownSection>
          <DropdownSection showDivider>
            <DropdownItem
              key="settings"
              href="/settings"
              classNames={{
                base: [
                  "text-default-500",
                  "data-[hover=true]:text-white-100",
                  "data-[hover=true]:bg-default-100",
                  "data-[selectable=true]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              }}
            >
              Settings
            </DropdownItem>
            <DropdownItem
              key="notifications"
              href="/notifications"
              classNames={{
                base: [
                  "text-default-500",
                  "data-[hover=true]:text-white-100",
                  "data-[hover=true]:bg-default-100",
                  "data-[selectable=true]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              }}
            >
              Notifications
            </DropdownItem>
            
            <DropdownItem
              isReadOnly
              endContent={
                <Switch
                  defaultChecked={theme != "dark"}
                  size="sm"
                  color="primary"
                  startContent={<SunIcon />}
                  endContent={<MoonIcon />}
                  onChange={(e) =>
                    setTheme(
                      !(e.target as HTMLInputElement).checked ? "light" : "dark"
                    )
                  }
                />
              }
            >
              Theme
              <DropdownItem />
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key="logout"
              color="danger"
              classNames={{
                base: [
                  "text-danger-500",
                  "data-[hover=true]:text-white-100",
                  "data-[hover=true]:bg-danger-100",
                  "data-[selectable=true]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              }}
              startContent={<FaArrowRightFromBracket />}
              href="/auth/login"
              onClick={(e: any) => {
                document.cookie =
                  "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie =
                  "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                // router.push("/auth/login");
              }}
            >
              Logout
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <SearchModal {...searchModal} />
    </div>
  );
};

export default BottomNavigation;
