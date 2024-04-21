import useUser from "@/hooks/useUser.hook";
import {
  Button,
  Divider,
  Skeleton,
  Switch,
  User,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  PiBell,
  PiHouse,
  PiMagnifyingGlass,
  PiQuestion,
  PiSignOutFill,
  PiTrendUpFill,
} from "react-icons/pi";
import PostModal from "./PostModal";
import { SearchModal } from ".";
import { MoonIcon } from "@/assets/svg/moon";
import { SunIcon } from "@/assets/svg/sun";
import { useTheme } from "next-themes";
const SideNavigation = () => {
  const { loading, data } = useUser();
  const postModal = useDisclosure();
  const searchModal = useDisclosure();

  const { theme, setTheme } = useTheme();

  const [avatar, setAvatar] = useState<string>("/images/user.png");
  useEffect(() => {
    if (!loading) {
      if (
        data?.getUser?.profile_picture !== null &&
        data?.getUser?.profile_picture !== undefined &&
        data?.getUser?.profile_picture !== "undefined"
      ) {
        setAvatar(data?.getUser.profile_picture);
      } else {
        setAvatar("/images/user.png");
      }
    }
  }, [loading, data]);

  return (
    <div
      className="absolute right-0 w-64 top-[10%] text-xl bg-slate-100/75 dark:bg-transparent
    text-black dark:text-white max-md:hidden"
    >
      <div className="p-6 fixed border-l border-black/20 dark:border-gray-100/20 min-h-[90%]">
        <div className="py-2.5 px-4 my-2 rounded-md transition duration-200 hover:bg-slate-200 dark:hover:bg-gray dark:hover:bg-opacity-10">
          <Link key={1} href={`/channel/${data?.getUser?.username}`}>
            <User
              name={
                !loading ? (
                  data?.getUser?.full_name.length > 12 ? (
                    (data?.getUser?.full_name as String).substring(0, 12) +
                    "..."
                  ) : (
                    data?.getUser?.full_name
                  )
                ) : (
                  <Skeleton className="w-20 rounded-lg h-4 mb-2" />
                )
              }
              description={
                !loading ? (
                  data?.getUser?.username !== undefined ? (
                    "@" + data?.getUser?.username
                  ) : (
                    ""
                  )
                ) : (
                  <Skeleton className="w-20 rounded-lg h-4" />
                )
              }
              classNames={{
                description: "text-default-500",
                name: "wrap overflow-hidden",
              }}
              avatarProps={{
                size: "lg",
                src: !loading ? avatar : "/images/user.png",
                alt: "User Profile Picture",
              }}
            />
          </Link>
        </div>
        <Divider />
        <Link
          className="flex items-center gap-2 py-2.5 mt-4 px-4 rounded-md transition duration-200 hover:bg-slate-200 dark:hover:bg-gray dark:hover:bg-opacity-10"
          href="/home"
          shallow={true}
        >
          <PiHouse size={24} />
          Home
        </Link>

        <Link
          className="flex items-center gap-2 py-2.5 my-1 px-4 rounded-md transition duration-200 hover:bg-slate-200 dark:hover:bg-gray dark:hover:bg-opacity-10"
          href="/notifications"
        >
          <PiBell size={24} />
          Notification
        </Link>

        <div
          className="flex items-center gap-2 py-2.5 my-1 px-4 rounded-md transition duration-200 hover:bg-slate-200 dark:hover:bg-gray dark:hover:bg-opacity-10"
          onClick={searchModal.onOpen}
        >
          <PiMagnifyingGlass size={24} />
          Search
        </div>

        <Link
          className="flex items-center gap-2 py-2.5 my-1 px-4 rounded-md transition duration-200 hover:bg-slate-200 dark:hover:bg-gray dark:hover:bg-opacity-10"
          href="/trending"
        >
          <PiTrendUpFill size={24} />
          Trending
        </Link>

        <Link
          className="flex items-center gap-2 py-2.5 my-1 px-4 rounded-md transition duration-200 hover:bg-slate-200 dark:hover:bg-gray dark:hover:bg-opacity-10"
          href="/"
        >
          <PiQuestion size={24} />
          Help
        </Link>

        <Link
          className="flex items-center gap-2 py-2.5 my-1 px-4 rounded-md transition duration-200 hover:bg-slate-200 dark:hover:bg-gray dark:hover:bg-opacity-10 text-danger"
          href="/auth/login"
          onClick={(e: any) => {
            document.cookie =
              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // router.push("/auth/login");
          }}
        >
          <PiSignOutFill size={24} />
          Logout
        </Link>

        <div className="flex justify-between items-center gap-2 py-2.5 my-1 px-4">
          Theme
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
        </div>

        <Button
          className="w-full absolute bottom-2 right-0 left-2 "
          variant="solid"
          color="primary"
          onPress={postModal.onOpen}
          size="sm"
        >
          Post
        </Button>

        {/* Modals */}
        <PostModal
          isOpen={postModal.isOpen}
          onOpenChange={postModal.onOpenChange}
        />
        <SearchModal {...searchModal} />
      </div>
    </div>
  );
};

export default SideNavigation;
