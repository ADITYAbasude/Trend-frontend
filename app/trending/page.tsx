"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import { Divider, Input } from "@nextui-org/react";
import { PiCaretLeft, PiMagnifyingGlass, PiTrendUp } from "react-icons/pi";
import { gql, useQuery } from "@apollo/client";
import { PostCard } from "@/components";
import { getUserId } from "@/utils/utils";
import { Metadata } from "next";

const Trending = () => {

  const metadata: Metadata = {
    title: "Trend trending memes",
    description: "See world trending memes in Trend",
  }

  const topics = ["trending", "popular", "new"];
  const [currentTopic, setCurrentTopic] = useState(topics[0]);

  const [searchTopics, setSearchTopics] = useState("".trim());
  const [userId, setUserId] = useState();

  const searchTopicsQuery = useQuery(
    gql`
      query SearchTopics($search: String!, $userId: ID!) {
        searchTopics(search: $search, userId: $userId) {
          id
          user_id
          caption
          meme_path
          popularity_score
          created_at
          updated_at
          total_views
          totalVotes
          user {
            id
            username
            full_name
            profile_picture
          }
          aggregateComments
          votes {
            id
            user_id
            post_id
            vote
            created_at
            updated_at
          }
          tagsBy {
            id
            post_id
            tagger_id
            user {
              id
              username
              full_name
              profile_picture
            }
            tagged_follower_id
          }
        }
      }
    `,
    {
      variables: { search: searchTopics, userId: userId },
      skip: !searchTopics || (searchTopics.trim().length !== 0 && !userId),
      fetchPolicy: "network-only",
    }
  );

  const getTrendingTopicsWithOnOfMemesQuery = useQuery(
    gql`
      query GetTrendingTopicsWithOnOfMemes {
        getTrendingTopicsWithOnOfMemes {
          topic
          meme_count
        }
      }
    `,
    {
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    getUserId().then((id: any) => {
      setUserId(id);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopic((prevTopic) => {
        const currentIndex = topics.indexOf(prevTopic);
        return topics[(currentIndex + 1) % topics.length];
      });
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="flex-col mt-[4rem] w-full sticky">
        <nav
          className="flex-col w-full py-4 justify-between items-center border-black/20
         dark:border-gray-100/20 border-b-1 sticky top-0 bg-white dark:bg-black/80 z-10"
        >
          {/* search bar */}
          <div className="flex w-full justify-center items-center animate-fade-in-down">
            <div
              className={`bg-slate-200 dark:bg-gray dark:bg-opacity-10 p-2 rounded-md mr-2 ${
                searchTopics.trim().length <= 0 ? "hidden" : "block"
              }`}
              onClick={()=> {
                setSearchTopics("");
              }}
            >
              <PiCaretLeft size={22} />
            </div>
            <div className="w-[18rem] relative">
              <Input
                size="md"
                placeholder={`Search ${currentTopic}...`}
                className="transition-all duration-500 ease-in-out text-black dark:text-white"
                variant="bordered"
                radius="md"
                labelPlacement="outside"
                endContent={<PiMagnifyingGlass color="#dfddddc9" />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchTopics(e.currentTarget.value.trim());
                  }
                }}
              />
              <div
                className="absolute top-0 left-0 w-full h-full bg-white transition-all duration-2000 ease-in-out"
                style={{
                  transform: `scaleX(${currentTopic ? 0 : 1})`,
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
          {/* //TODO: future implementation */}
          {/* <ScrollShadow
            orientation="horizontal"
            className="w-full flex even:gap-1 mt-2"
          >
            {chipsName.map((chipName, index) => (
              <Chip size="md" key={index} variant="bordered" color="secondary">
                {chipName}
              </Chip>
            ))}
          </ScrollShadow> */}
        </nav>
      </div>

      <div
        className={`flex-col items-center mx-4 ${
          searchTopics.trim().length > 0 ? "hidden" : "block"
        } mb-[2rem]`}
      >
        <h3 className="p-2 flex items-center text-black dark:text-white">
          <PiTrendUp />
          &nbsp; Trending topics
        </h3>
        {getTrendingTopicsWithOnOfMemesQuery.data?.getTrendingTopicsWithOnOfMemes?.map(
          (topic: any, index: number) => (
            <React.Fragment key={index}>
              <div
                className="flex items-center py-2 text-black dark:text-white cursor-pointer"
                onClick={() => {
                  setSearchTopics(topic.topic);
                }}
              >
                <span className="mx-2">{index + 1}</span>
                <div className="flex-col p-1">
                  <span className="text-sm">{topic.topic}</span>
                  <p className="text-xs">{topic.meme_count} memes</p>
                </div>
              </div>
              <Divider />
            </React.Fragment>
          )
        )}
      </div>

      <div
        className={`flex w-full justify-around ${
          searchTopics.trim().length !== 0 ? "block" : "hidden"
        }`}
      >
        <div className="lg:w-[450px] mb-[2rem] max-sm:mb-[4rem] justify-around">
          {searchTopicsQuery.data?.searchTopics?.map(
            (post: any, index: number) => {
              return (
                <article
                  key={index}
                  className="my-2 bg-transparent text-black dark:text-white"
                >
                  <PostCard {...post} />
                </article>
              );
            }
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Trending;
