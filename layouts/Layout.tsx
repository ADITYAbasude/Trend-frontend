"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SideNavigation , PostModal} from "../components";
import BottomNavigation from "@/components/BottomNavigation";
import TopLoader from "@/components/TopLoader";
import { useDisclosure } from "@nextui-org/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const emojiNervousToHappy = ["😰", "😊", "😄", "😃", "😁", "😆"];

  const postModal = useDisclosure();

  const [emoji, setEmoji] = useState(emojiNervousToHappy[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmoji((e) => {
        const currentIndex = emojiNervousToHappy.indexOf(e);
        return emojiNervousToHappy[
          (currentIndex + 1) % emojiNervousToHappy.length
        ];
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="select-none">
      <TopLoader />
      <Header />
      <main className=" mr-0 max-md:m-1 md:mr-[17rem] lg:mr-[17rem]">
        {children}
      </main>
      <SideNavigation />
      <BottomNavigation />
      <div className="hidden max-md:block ">
        <div className="fixed bottom-[4.5rem] right-4 z-50">
          <div
            className="p-2 duration-[2000ms] animate-bounce bg-primary rounded-full w-[50px] h-[50px] flex items-center justify-center "
            onClick={postModal.onOpen}
          >
            {emoji}
          </div>
        </div>
        <PostModal
          isOpen={postModal.isOpen}
          onOpenChange={postModal.onOpenChange}
        />
      </div>
    </div>
  );
};

export default Layout;
