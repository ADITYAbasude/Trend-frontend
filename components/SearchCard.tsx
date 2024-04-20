import { gql, useMutation } from "@apollo/client";
import { Avatar, Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getUserId } from "@/utils/utils";

interface userExtendedInterface extends UserObject {
  getUser: UserObject;
}

export const SearchCard = (user: userExtendedInterface) => {
  const [clicked, setClicked] = useState(user.Following);
  const [userId, setUserId] = useState<string | undefined>(undefined)

  const [follow] = useMutation(
    gql`
      mutation Follow($followerId: ID!, $userId: ID!) {
        handleFollow(followerId: $followerId, userId: $userId)
      }
    `
  );

  const [unfollow] = useMutation(
    gql`
      mutation Mutation($followerId: ID!, $userId: ID!) {
        handleUnfollow(followerId: $followerId, userId: $userId)
      }
    `
  );
  console.log(user);
  const handleFollowButton = (followerId: string) => {
    if (clicked) {
      unfollow({
        variables: { followerId: followerId, userId: user.getUser.id },
      });
      setClicked(false);
    } else {
      follow({
        variables: { followerId: followerId, userId: user.getUser.id },
      });
      setClicked(true);
    }
  };

  useEffect(() => {
    setClicked(user.Following);
  }, [user.Following]);

  useEffect(() => {
    getUserId().then((res: any) => setUserId(res));
  })
  return (
    <div className="my-1 w-full p-1 rounded-md hover:bg-slate-200 dark:hover:bg-gray dark:hover:bg-opacity-10 relative">
      <Link
        className={"flex justify-between cursor-pointer items-center"}
        href={`/channel/${user.username}`}
        shallow={true}
      >
        <div className="flex">
          <Avatar
            size={"md"}
            src={user.profile_picture ?? "/images/user.png"}
          />
          <div className={"ml-2"}>
            <div className={"text-sm"}>{user.full_name}</div>
            <div className={"text-xs text-default-500"}>@{user.username}</div>
          </div>
        </div>
        <div>
          <Button
            size="sm"
            variant={clicked ? "bordered" : "solid"}
            className={`
              ${
                clicked
                  ? "border-black dark:border-white text-black dark:text-white"
                  : "bg-primary text-white"
              } w-[75px] ${
              user.id != userId ? "visible" : "invisible"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleFollowButton(user.id);
            }}
            radius="md"
          >
            {clicked ? "Following" : "Follow"}
          </Button>
        </div>
      </Link>
    </div>
  );
};
