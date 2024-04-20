"use client";

import { PostCard } from "@/components";
import useUser from "@/hooks/useUser.hook";
import Layout from "@/layouts/Layout";
import { getUserId } from "@/utils/utils";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Divider,
  Skeleton,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PiFireFill, PiPenThin } from "react-icons/pi";
import InfiniteScroll from "react-infinite-scroll-component";

const Profile = () => {
  const router = useRouter();
  const getUsername = usePathname();
  const user = useUser();

  const [userId, setUserId] = useState<String>();
  const [currentUserId, setCurrentUserId] = useState<String>();
  const [avatar, setAvatar] = useState<string>("/images/user.png");
  const [username, setUsername] = useState<string>("");
  const [clicked, setClicked] = useState(false);

  const getMetaData = useQuery(
    gql`
      query user($id: ID!, $yourId: ID!) {
        getUser(id: $id, yourId: $yourId) {
          id
          username
          full_name
          profile_picture
          bio
          totalMemes
          totalFollowers
          totalPopularity
          Following
        }
      }
    `,
    {
      variables: { id: userId, yourId: currentUserId },
      skip:
        !userId ||
        userId === undefined ||
        !currentUserId ||
        currentUserId === undefined,
    }
  );

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

  const getIdByUsername = useQuery(
    gql`
      query getIdByUsername($username: String!) {
        getIdByUsername(username: $username)
      }
    `,
    {
      variables: { username: username },
      skip: !username || username === undefined,
    }
  );

  const getUserPost = useQuery(
    gql`
      query Query($token: String!, $offset: Int!, $limit: Int!) {
        getUserPost(token: $token, offset: $offset, limit: $limit) {
          edges {
            id
            meme_path
            caption
            popularity_score
            aggregateComments
            created_at
            total_views
            totalVotes
            user {
              id
              username
              full_name
              profile_picture
            }
            votes {
              id
              vote
            }
          }
          hasNextPage
        }
      }
    `,
    {
      variables: { token: userId, offset: 0, limit: 2 },
      skip: !userId || userId === undefined,
    }
  );

  const handleFollowButton = (followerId: string) => {
    if (clicked) {
      unfollow({
        variables: { followerId: followerId, userId: currentUserId },
      });
      setClicked(false);
    } else {
      follow({
        variables: { followerId: followerId, userId: currentUserId },
      });
      setClicked(true);
    }
  };

  useEffect(() => {
    if (getIdByUsername.data !== undefined) {
      setUserId(getIdByUsername.data.getIdByUsername);
    }
  }, [getIdByUsername.data]);

  useEffect(() => {
    if (getUsername !== undefined) {
      setUsername(getUsername.split("/")[2]);
    }
  }, [getUsername]);

  useEffect(() => {
    setClicked(getMetaData?.data?.getUser.Following);
  }, [getMetaData.data?.getUser.Following]);

  useEffect(() => {
    getUserId().then((res: any) => setCurrentUserId(res));
  }, []);

  const handleDelete = async (id: string) => {
    getUserPost.data.getUserPost.filter((post: any) => post.id !== id);
  };

  useEffect(() => {
    if (
      getMetaData.data?.getUser.profile_picture !== null &&
      getMetaData.data?.getUser.profile_picture !== undefined
    ) {
      setAvatar(getMetaData.data?.getUser.profile_picture);
    } else {
      setAvatar("/images/user.png");
    }
  }, [getMetaData.data]);
  return (
    <Layout>
      <div className="select-none items-center h-full w-full lg:mx-16 mt-[5rem] lg-mt-[8rem] text-black dark:text-white">
        <div className="flex max-lg:flex-col w-full">
          <div className="flex w-full justify-between lg:w-[15rem]">
            <div className="flex w-full lg:flex-col">
              <div>
                <Avatar
                  draggable={false}
                  className="md:h-[8rem] md:w-[8rem] w-[4rem] h-[4rem] lg:m-8"
                  src={!getMetaData.loading ? avatar : "/images/user.png"}
                />
              </div>
              <div className="mx-2 flex-col md:mt-4 w-full ">
                {getMetaData.data?.getUser.username !== undefined ? (
                  <h1 className="text-xl md:text-2xl ">
                    {getMetaData.data?.getUser.full_name}
                  </h1>
                ) : (
                  <Skeleton className="w-20 rounded-lg h-4" />
                )}

                {getMetaData.data?.getUser.username !== undefined ? (
                  <p className="text-sm text-default-500">
                    @{getMetaData.data?.getUser.username}
                  </p>
                ) : (
                  <Skeleton className="w-20 mt-1 rounded-lg h-4" />
                )}

                {getMetaData.data?.getUser.bio !== undefined ? (
                  <p className="mt-4 text-sm">
                    {getMetaData.data?.getUser.bio}
                  </p>
                ) : (
                  <Skeleton className="w-full mt-2 rounded-lg h-8" />
                )}

                <div className="flex gap-2 mt-12 text-sm lg:flex-col">
                  <div>
                    {getMetaData.data?.getUser.totalMemes}{" "}
                    <span className="text-default-500">Memes</span>{" "}
                  </div>
                  <div>
                    {getMetaData.data?.getUser.totalFollowers}{" "}
                    <span className="text-default-500">Followers</span>
                  </div>
                  <div className="flex items-center">
                    <PiFireFill size={18} color={"#FF4500"} />{" "}
                    {getMetaData.data?.getUser.totalPopularity}&nbsp;{" "}
                    <span className="text-default-500">T.P</span>
                  </div>
                </div>
                {getMetaData.data?.getUser.id !== currentUserId && (
                  <Button
                    size="sm"
                    variant={clicked ? "bordered" : "solid"}
                    className={` m-1
              ${
                clicked
                  ? "border-black dark:border-white text-black dark:text-white"
                  : "bg-primary text-white"
              } w-[75px] ${
                      getMetaData.data?.getUser.id == currentUserId
                        ? "invisible"
                        : "visible"
                    }`}
                    onClick={(e) => {
                      handleFollowButton(getMetaData.data?.getUser.id);
                    }}
                    radius="md"
                  >
                    {clicked ? "Following" : "Follow"}
                  </Button>
                )}
                <Divider className="mt-4 hidden lg:block" />
              </div>
            </div>

            {userId === user.data?.getUser.id && (
              <div>
                <Tooltip
                  content="Edit profile"
                  showArrow
                  placement="bottom"
                  size="sm"
                  delay={2000}
                >
                  <Link
                    color={undefined}
                    href={"/accounts/edit"}
                    className="flex items-center p-2 rounded-full transition duration-200 hover:bg-slate-200 dark:hover:bg-gray dark:hover:bg-opacity-10"
                  >
                    <PiPenThin size={28} />
                  </Link>
                </Tooltip>
              </div>
            )}
          </div>
          <Divider className="mt-4 block lg:hidden " />
          <div className="w-full flex justify-center max-lg:mt-4">
            <InfiniteScroll
              dataLength={getUserPost.data?.getUserPost.edges.length ?? 0}
              next={async () =>
                await getUserPost.fetchMore({
                  variables: {
                    offset: getUserPost.data
                      ? getUserPost.data?.getUserPost?.edges.length
                      : 0,
                  },
                  updateQuery(previousQueryResult, { fetchMoreResult }) {
                    if (!fetchMoreResult) return previousQueryResult;
                    return {
                      ...previousQueryResult,
                      getUserPost: {
                        ...previousQueryResult.getUserPost,
                        edges: [
                          ...previousQueryResult.getUserPost.edges,
                          ...fetchMoreResult.getUserPost.edges,
                        ],
                        hasNextPage: fetchMoreResult.getUserPost.hasNextPage,
                      },
                    };
                  },
                })
              }
              hasMore={getUserPost.data?.getUserPost.hasNextPage}
              loader={
                <div className="flex justify-center mb-[8rem]">
                  <Spinner color="primary" />
                </div>
              }
            >
              <div className="mb-6 lg:w-[450px] max-sm:mb-[4rem]">
                {getUserPost.data?.getUserPost?.edges.map((post: any) => {
                  return (
                    <PostCard
                      key={post.id}
                      {...post}
                      onDelete={() => handleDelete(post.id)}
                    />
                  );
                })}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
