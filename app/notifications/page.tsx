"use client";

import { Loading } from "@/components";
import {
  NOTIFICATION_COMMENT,
  NOTIFICATION_FOLLOW,
  NOTIFICATION_LIKE,
  NOTIFICATION_POST,
} from "@/constant/notification.constant";
import Layout from "@/layouts/Layout";
import { getUserId, timeAgo } from "@/utils/utils";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Avatar, Button } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const GET_NOTIFICATION = gql`
  query getNotifications($userId: ID!) {
    getNotifications(userId: $userId) {
      post_id
      created_at
      notification_type
      sender_user {
        id
        username
        full_name
        profile_picture
        Following
      }
    }
  }
`;

const NotificationPage = () => {
  const [userId, setUserId] = useState<undefined | String>(undefined);

  useEffect(() => {
    getUserId().then((id) => setUserId(id));
  }, []);

  const getNotifications = useQuery(GET_NOTIFICATION, {
    variables: { userId },
    skip: !userId || userId === undefined,
  });

  return (
    <Layout>
      <div className="my-[4.5rem]">
        <div className="flex-col items-center justify-center md:ml-4">
          {getNotifications.data?.getNotifications
            ? getNotifications.data?.getNotifications.map(
                (notification: any, index: number) => {
                  return (
                    <NotificationComponent
                      key={index}
                      notification={notification}
                      userId={userId || ""}
                    />
                  );
                }
              )
            : getNotifications.loading ?? <div>No Notification</div>}
        </div>
      </div>
      {getNotifications.loading ?? <Loading />}
    </Layout>
  );
};

const NotificationComponent: React.FC<{
  notification: any;
  userId: String;
}> = ({ notification, userId }) => {
  const [clicked, setClicked] = useState(notification?.sender_user.Following);

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

  const handleFollowButton = (followerId: string) => {
    if (clicked) {
      unfollow({
        variables: { followerId: followerId, userId: userId },
      });
      setClicked(false);
    } else {
      follow({
        variables: { followerId: followerId, userId: userId },
      });
      setClicked(true);
    }
  };

  return (
    <Link
      className="text-black dark:text-white bg-slate-200 dark:bg-gray dark:bg-opacity-10 m-1 p-2 max-sm:p-1
            flex justify-between items-center rounded-sm"
      href={
        notification?.post_id
          ? `/post/${notification?.post_id}`
          : `/channel/${notification?.sender_user.username}`
      }
    >
      <div className="flex items-center">
        <Avatar
          src={notification?.sender_user?.profile_picture ?? "/images/user.png"}
          size="sm"
          className="mr-2"
        />
        <Link
          href={`/channel/${notification?.sender_user?.username}`}
          className="text-md p-0 m-0"
        >
          {notification?.sender_user.username}
        </Link>
        &nbsp;
        <h1 className="text-sm text-default-500">
          {notification?.notification_type === NOTIFICATION_POST ? (
            <>posted a meme</>
          ) : null}
          {notification?.notification_type === NOTIFICATION_FOLLOW ? (
            <>started following you</>
          ) : null}
          {notification?.notification_type === NOTIFICATION_LIKE ? (
            <>voted on your meme</>
          ) : null}
          {notification?.notification_type === NOTIFICATION_COMMENT ? (
            <>commented on your meme</>
          ) : null}
        </h1>
        {notification?.notification_type === NOTIFICATION_FOLLOW ? (
          <Button
            size="sm"
            variant={clicked ? "bordered" : "solid"}
            className={`
            m-1
            ${
              clicked
                ? "border-black dark:border-white text-black dark:text-white"
                : "bg-primary text-white"
            } w-[75px]`}
            onClick={(e) => {
              e.preventDefault();
              handleFollowButton(userId as string);
            }}
            radius="md"
          >
            {clicked ? "Following" : "Follow"}
          </Button>
        ) : null}
      </div>
      <span className="sm text-xs text-default-500">
        {timeAgo(parseInt(notification?.created_at))}
      </span>
    </Link>
  );
};
export default NotificationPage;
