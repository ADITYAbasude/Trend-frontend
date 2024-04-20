"use client";

import { PostCard } from "@/components";
import Layout from "@/layouts/Layout";
import { getUserId } from "@/utils/utils";
import { gql, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const PostView = () => {
  const getPostId = usePathname();

  const [userId, setUserId] = useState();

  useEffect(() => {
    getUserId().then((id: any) => {
      setUserId(id);
    });
  }, [getPostId]);

  const postQuery = useQuery(
    gql`
      query Query($postId: ID!, $userId: ID!) {
        getPostById(postId: $postId, userId: $userId) {
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
      variables: { postId: getPostId.split("/")[2], userId: userId },
      skip:
        !userId ||
        !getPostId.split("/")[2] ||
        getPostId.split("/")[2] === undefined,
    }
  );


  return (
    <Layout>
      {postQuery.data !== undefined && (
        <div className="my-[4.5rem] text-black dark:text-white flex justify-center">
          <PostCard {...(postQuery.data?.getPostById)} />
        </div>
      )}
    </Layout>
  );
};

export default PostView;
