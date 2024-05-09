/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Loading } from "@/components";
import Layout from "@/layouts/Layout";
import useUser from "@/hooks/useUser.hook";
import { useUserStore } from "@/stores/user.store";
import { getToken, getUserId } from "@/utils/utils";
import { gql, useQuery } from "@apollo/client";
import { Button, Input, Skeleton, Textarea, User } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { Metadata } from "next";

const Edit = () => {
  const { loading, data, refetch } = useUser();
  const { successful, loadingStatus } = useUserStore((state) => state);

  const [token, setToken] = useState<String>();
  const photoRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string>("/images/user.png");
  const [userData, setUserData] = useState({
    full_name: "",
    bio: "",
  });

  const handleButtonClick = () => {
    photoRef.current?.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: any) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getUserId().then((res) => setToken(res));
  }, []);

  const getBio = useQuery(
    gql`
      query user($id: ID!) {
        getUser(id: $id) {
          bio
        }
      }
    `,
    {
      variables: { id: token },
      skip: !token || token === undefined,
    }
  );

  useEffect(() => {
    if (successful) {
      refetch();
      getBio.refetch();
    }
  }, [successful]);

  useEffect(() => {
    setUserData({
      full_name: data?.getUser.full_name,
      bio: getBio.data?.getUser.bio,
    });
    if (
      data?.getUser.profile_picture !== null &&
      data?.getUser.profile_picture !== undefined &&
      data?.getUser.profile_picture !== "undefined"
    ) {
      setAvatar(data?.getUser.profile_picture);
    } else {
      setAvatar("/images/user.png");
    }
  }, [data, getBio.data]);

  const metadata: Metadata = {
    title: `Edit Trend channel`,
    description: 'Follow Trend channels to get more funny memes.'
  };

  return (
    <Layout>
      <div className="flex justify-center items-start h-full w-full my-[6rem] text-black dark:text-white max-md:mt-40">
        <div className="h-full w-[70%] max-sm:w-full">
          <div
            className="bg-slate-100/75 dark:bg-gray-900/75 backdrop-blur transition-colors w-full p-4 max-sm:p-2 flex items-center justify-between
           rounded-lg "
          >
            <User
              name={
                !loading ? (
                  data?.getUser.full_name
                ) : (
                  <Skeleton className="w-20 rounded-lg h-4 mb-2" />
                )
              }
              description={
                !loading ? (
                  data?.getUser.username !== undefined ? (
                    "@" + data?.getUser.username
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
                className: "cursor-pointer",
                onClick: handleButtonClick,
                src: !loading ? avatar : "/images/user.png",
              }}
            />
            <div className="flex justify-between max-md:flex-col">
              <Button
                size="sm"
                variant="bordered"
                className="mr-2 max-md:mb-2"
                onClick={() => {
                  useUserStore.getState().removeProfilePicture();
                }}
              >
                Remove
              </Button>
              <Button
                size="sm"
                color="primary"
                onClick={() => {
                  useUserStore.getState().updateProfilePicture(avatarFile);
                }}
              >
                Change photo
              </Button>
            </div>
            <input
              type="file"
              ref={photoRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              name="avatar"
            />
          </div>
          <Input
            className="mt-16 mb-4"
            type="text"
            maxLength={15}
            variant="bordered"
            radius="md"
            name="full_name"
            placeholder="Full name"
            value={userData.full_name}
            onChange={handleInputChange}
          />

          <Textarea
            type="text"
            maxLength={150}
            variant="bordered"
            placeholder="Bio"
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
            description={`${userData.bio?.length ?? 0}/150`}
          />
          <Button
            className="mt-4"
            color="primary"
            variant="solid"
            onClick={() => {
              useUserStore
                .getState()
                .updateProfile(userData.full_name, userData.bio);
            }}
          >
            Save changes
          </Button>
        </div>
        {loadingStatus && (
          <div className="fixed h-full w-full top-[50%] bottom-[50%] translate-y-[-50%]">
            <Loading />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Edit;
