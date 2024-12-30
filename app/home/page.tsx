"use client";

import { Loading, PostCard } from "@/components";
import { SearchCard } from "@/components/SearchCard";
import useUser from "@/hooks/useUser.hook";
import Layout from "@/layouts/Layout";
import { useAuthStore } from "@/stores/auth.store";
import { getToken, getUserId } from "@/utils/utils";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "@nextui-org/react";
import { Metadata } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PiArrowFatDownFill,
  PiArrowFatUpFill,
  PiGlobeHemisphereEastFill,
  PiMinusCircleFill,
} from "react-icons/pi";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const [id, setId] = useState<String | undefined>();
  const [token, setToken] = useState<String | undefined>();

  const { valid, loading } = useAuthStore((state) => state);
  const router = useRouter();

  const user = useUser();

  useEffect(() => {
    getUserId()
      .then((res) => setId(res))
      .catch((err) => console.log(err));
    getToken()
      .then((res) => {
        if (res) setToken(res);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const posts = useQuery(
    gql`
      query post($id: ID!, $offset: Int!, $limit: Int!) {
        getPost(id: $id, offset: $offset, limit: $limit) {
          edges {
            id
            meme_path
            popularity_score
            created_at
            caption
            aggregateComments
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
            tagsBy {
              user {
                full_name
              }
            }
          }
          hasNextPage
        }
      }
    `,
    {
      variables: { id: id, offset: 0, limit: 2 },
      skip: !id || id === undefined,
    }
  );

  const trendingChannels = useQuery(
    gql`
      query trendingChannels($id: ID!) {
        getTrendingUsers(id: $id) {
          id
          username
          full_name
          profile_picture
          totalMemes
          totalFollowers
          totalPopularity
          Following
        }
      }
    `,
    {
      variables: { id: id },
      skip: !id || id === undefined,
    }
  );

  //* token verification
  useEffect(() => {
    if (token !== "undefined" && token !== undefined) {
      useAuthStore.getState().verifyUser();
      if (valid && token) router.push("/home");
    } else {
      router.push("/auth/login");
    }
  }, [token, router, valid]);

  return (
    <>
      <Layout>
      <Head>
        <title>Home Feed | Trend</title>
        <meta name="description" content="Your personalized feed of the best memes from creators you follow" />
        <link rel="canonical" href="https://trend-dusky.vercel.app/home" />
        <meta property="og:title" content="Trending Memes Feed | Trend" />
        <meta property="og:description" content="Discover the most popular memes and trending content" />
      </Head>
        <div className="flex justify-end max-lg:justify-center">
          {trendingChannels.data && (
            <div
              className={`my-[4.5rem] mx-0 fixed left-1 right-1 border-black/20 dark:border-gray-100/20 border-1 
          w-[27%] rounded-md max-lg:hidden text-black dark:text-white ${
            posts.data?.getPost?.edges.length == 0 &&
            "max-md:block max-md:w-full"
          }`}
            >
              <h3 className="p-2 flex items-center">
                <PiGlobeHemisphereEastFill color="#4682B4" /> &nbsp;Top channels
              </h3>
              {trendingChannels.data?.getTrendingUsers.map(
                (e: any, index: number) => {
                  return (
                    <div key={index} className="flex items-center px-2">
                      <span>{index + 1}&nbsp;</span>
                      <UpDownArrow totalPopularity={e.totalPopularity} />
                      <SearchCard {...e} {...user.data} />
                    </div>
                  );
                }
              )}
            </div>
          )}
          <div
            className="flex flex-col justify-center items-center mt-[4rem] float-right
          text-black dark:text-white w-[70%]"
          >
            <InfiniteScroll
              dataLength={posts.data?.getPost.edges.length ?? 0}
              next={async () =>
                await posts.fetchMore({
                  variables: {
                    offset: posts.data ? posts.data?.getPost?.edges.length : 0,
                  },
                  updateQuery(previousQueryResult, { fetchMoreResult }) {
                    if (!fetchMoreResult) return previousQueryResult;
                    return {
                      ...previousQueryResult,
                      getPost: {
                        ...previousQueryResult.getPost,
                        edges: [
                          ...previousQueryResult.getPost.edges,
                          ...fetchMoreResult.getPost.edges,
                        ],
                        hasNextPage: fetchMoreResult.getPost.hasNextPage,
                      },
                    };
                  },
                })
              }
              hasMore={posts.data?.getPost.hasNextPage}
              loader={
                <div className="flex justify-center mb-[8rem]">
                  <Spinner color="primary" />
                </div>
              }
            >
              <div className="lg:w-[450px] max-sm:mb-[4rem] sm:mb-[4rem]">
                {posts.data !== undefined &&
                  posts.data?.getPost.edges !== null &&
                  posts.data?.getPost.edges.map((e: any, index: number) => {
                    return (
                      <article key={index} className="my-2 bg-transparent">
                        {" "}
                        <PostCard {...e} />
                      </article>
                    );
                  })}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </Layout>
    </>
  );
}

const UpDownArrow = (props: any) => {
  if (props.totalPopularity > 0) {
    return <PiArrowFatUpFill color="green" />;
  } else if (props.totalPopularity < 0) {
    return <PiArrowFatDownFill color="red" />;
  } else {
    return <PiMinusCircleFill color={"grey"} />;
  }
};
