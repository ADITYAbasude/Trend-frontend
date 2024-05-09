import { usePostStore } from "@/stores/post.store";
import { getUserId, timeAgo } from "@/utils/utils";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Image,
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import React, {
  LegacyRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PiArrowFatDown,
  PiArrowFatDownFill,
  PiArrowFatUp,
  PiArrowFatUpFill,
  PiCaretLeft,
  PiCaretRight,
  PiDotsThreeVerticalBold,
  PiExport,
  PiPaperPlaneTilt,
  PiPolygon,
  PiTrash,
  PiUsersThree,
  PiWarningCircle,
} from "react-icons/pi";
import { Share } from ".";

const PostCard = (meme: any) => {
  const e = meme;

  //TODO: implement a delete feature
  const { onDelete } = meme;

  const [userId, setUserId] = useState<undefined | String>(undefined);

  const postContentRef = useRef(null);
  const canvasRef = useRef(null);

  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const shareDisclosure = useDisclosure();

  const [isHoveredUp, setIsHoveredUp] = useState(false);
  const [isHoveredDown, setIsHoveredDown] = useState(false);
  const [isClickedUp, setIsClickedUp] = useState(false);
  const [isClickedDown, setIsClickedDown] = useState(false);

  const [postVote, setPostVote] = useState(0);
  const [memePathIndex, setMemePathIndex] = useState(0);

  const [isHoveredComment, setIsHoveredComment] = useState(false);
  const [isClickedComment, setIsClickedComment] = useState(false);

  const [isClickedTag, setIsClickedTag] = useState(false);

  const [isHoveredShare, setIsHoveredShare] = useState(false);

  const [ref, isIntersecting]: any = useOnScreen({
    threshold: 0.1,
  });

  const [values, setValues] = useState([]);

  // TODO: implement a search feature
  const [searchText, setSearchText] = useState("");
  const arrayValues = Array.from(values);

  const searchResults = useQuery(
    gql`
      query Query($id: ID!) {
        searchFollowerUsers(id: $id) {
          follower_id
          User {
            full_name
            username
            profile_picture
            id
          }
        }
      }
    `,
    {
      variables: { id: userId },
      skip: !userId || userId === undefined,
    }
  );

  const getTaggers = useQuery(
    gql`
      query Query($postId: ID!, $userId: ID!) {
        getTaggers(postId: $postId, userId: $userId) {
          post_id
          tagged_follower_ids
        }
      }
    `,
    {
      variables: { postId: e.id, userId: userId },
      skip: !isClickedTag || !userId || userId === undefined,
    }
  );
  //mutation
  const [castVote] = useMutation(gql`
    mutation CastVote($postId: ID!, $userId: ID!, $vote: Int!) {
      castVote(postId: $postId, userId: $userId, vote: $vote)
    }
  `);

  // no upVote and no downVote instead neutral
  const [discontinueVote] = useMutation(gql`
    mutation DiscontinueVote($postId: ID!, $userId: ID!, $value: Int!) {
      discontinueVote(postId: $postId, userId: $userId, value: $value)
    }
  `);

  const [tagPost, { loading: tagPostLoading }] = useMutation(gql`
    mutation Mutation($postId: ID!, $userId: ID!, $taggers: [ID!]) {
      tagPost(postId: $postId, userId: $userId, taggers: $taggers)
    }
  `);

  const [taggedPostSeenByUser] = useMutation(gql`
    mutation Mutation($postId: ID!) {
      taggedPostSeenByUser(postId: $postId)
    }
  `);

  const handleVote = (postId: string, vote: number) => {
    // User wants to upvote
    if (vote === 1) {
      if (isClickedUp) {
        // User wants to undo their upvote
        setIsClickedUp(false);
        discontinueVote({ variables: { postId, userId, value: -1 } });
        setPostVote((prevVote) => prevVote - 1);
      } else {
        // User wants to change their downvote to an upvote, or upvote for the first time
        if (isClickedDown) {
          setIsClickedDown(false);
          discontinueVote({ variables: { postId, userId, value: 1 } });
          setPostVote((prevVote) => prevVote + 1);
        }
        setIsClickedUp(true);
        castVote({ variables: { postId, userId, vote } });
        setPostVote((prevVote) => prevVote + 1);
      }
    }
    // User wants to downvote
    else if (vote === -1) {
      if (isClickedDown) {
        // User wants to undo their downvote
        setIsClickedDown(false);
        discontinueVote({ variables: { postId, userId, value: 1 } });
        setPostVote((prevVote) => prevVote + 1);
      } else {
        // User wants to change their upvote to a downvote, or downvote for the first time
        if (isClickedUp) {
          setIsClickedUp(false);
          discontinueVote({ variables: { postId, userId, value: -1 } });
          setPostVote((prevVote) => prevVote - 1);
        }
        setIsClickedDown(true);
        castVote({ variables: { postId, userId, vote } });
        setPostVote((prevVote) => prevVote - 1);
      }
    }
  };

  const handleTag = (postId: string, taggers: string[]) => {
    if (taggers.length === 0) return;
    tagPost({ variables: { postId, userId, taggers } });
    getTaggers.refetch();
  };

  const handleMemePathIndex = () => {
    if (memePathIndex < e.meme_path.length - 1) {
      setMemePathIndex((prev) => prev + 1);
    } else {
      setMemePathIndex(0);
    }
  };

  useEffect(() => {
    getUserId().then((id) => setUserId(id));
  }, []);

  useEffect(() => {
    if (isIntersecting) {
      taggedPostSeenByUser({
        variables: {
          postId: e.id,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);

  useEffect(() => {
    if (e.votes?.length > 0) {
      if (e?.votes[0].vote === 1) {
        setIsClickedUp(true);
      } else if (e?.votes[0].vote === -1) {
        setIsClickedDown(true);
      }
    }
  }, [e?.votes]);

  useEffect(() => {
    setPostVote(e.popularity_score);
  }, [e.popularity_score]);

  useEffect(() => {
    if (getTaggers.data?.getTaggers[0]?.tagged_follower_ids) {
      setValues(getTaggers.data?.getTaggers[0]?.tagged_follower_ids);
    }
  }, [getTaggers.data]);

  // tag top content
  const topContent = useMemo(() => {
    if (!arrayValues.length) {
      return null;
    }
    return (
      <ScrollShadow
        hideScrollBar
        className="flex flex-wrap gap-1"
        orientation="horizontal"
      >
        {arrayValues.map((value) => (
          <Chip
            variant="bordered"
            color="secondary"
            size="sm"
            className="items-center p-0 text-xs border-1"
            key={value}
          >
            @
            {
              searchResults.data?.searchFollowerUsers.find(
                (user: any) => `${user.User.id}` === `${value}`
              )?.User.username
            }
          </Chip>
        ))}
      </ScrollShadow>
    );
  }, [arrayValues, searchResults.data?.searchFollowerUsers]);

  return (
    <>
      <canvas hidden ref={canvasRef} />
      <div
        ref={ref as unknown as LegacyRef<HTMLDivElement> | undefined}
        className="p-4 max-sm:px-2 max-sm:pb-1 even:mt-2 border-black/20 dark:border-gray-100/20 border-1 rounded-md"
      >
        {e.tagsBy?.length > 0 && (
          <div className="p-2 flex justify-between mb-2 bg-slate-200 dark:bg-gray-50/10 rounded-sm">
            <div className="text-xs text-default-500">
              <span className="text-xs text-default-500">
                {e.tagsBy.map((tag: any, index: number) => (
                  <span key={index}>
                    <span className="text-default-600">
                      {tag.user.full_name}
                      {index !== e.tagsBy.length - 1 && ", "}
                    </span>
                  </span>
                ))}{" "}
                tagged you
              </span>
            </div>
          </div>
        )}
        <div className="mb-0 mt-0">
          <div className="flex justify-between">
            <div className="flex">
              <Link href={`/channel/${e.user?.username}`}>
                <Avatar
                  size="md"
                  alt={e.user?.full_name}
                  isBordered
                  src={e.user?.profile_picture ?? "/images/user.png"}
                />
              </Link>
              <div className="ml-2">
                <div className="text-sm">{e.user?.full_name}</div>
                <div className="text-xs text-default-500">
                  @{e.user?.username}
                </div>
              </div>
            </div>

            <div className="flex float-right">
              <div className="flex text-xs text-default-500 justify-center items-center h-full">
                {timeAgo(parseInt(e?.created_at))}
              </div>

              {/*  post menu button */}
              <Dropdown
                trigger="press"
                showArrow
                radius="sm"
                placement="left-start"
                className="text-black dark:text-white"
              >
                <DropdownTrigger>
                  <Button
                    className="bg-transparent"
                    radius="full"
                    variant="light"
                    isIconOnly
                  >
                    <PiDotsThreeVerticalBold size={18} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Static Actions"
                  itemClasses={{
                    title: ["text-sm"],
                    base: [
                      "text-sm",
                      "transition-opacity",
                      "data-[hover=true]:text-foreground",
                      "data-[hover=true]:bg-default-100",
                      "dark:data-[hover=true]:bg-default-50",
                      "data-[selectable=true]:focus:bg-default-50",
                      "data-[pressed=true]:opacity-70",
                      "data-[focus-visible=true]:ring-default-500",
                    ],
                  }}
                >
                  <DropdownSection>
                    <DropdownItem
                      key="shareVia"
                      endContent={<PiPaperPlaneTilt />}
                      onClick={() => {
                        shareDisclosure.onOpen();
                      }}
                    >
                      Share via
                    </DropdownItem>

                    <DropdownItem key="report" endContent={<PiWarningCircle />}>
                      Report
                    </DropdownItem>

                    <DropdownItem
                      key="delete"
                      className="text-danger data-[hover=true]:text-danger"
                      endContent={<PiTrash />}
                      hidden={e.user.id !== userId}
                      onPress={() => {
                        usePostStore.getState().deletePost(e.id);
                      }}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div ref={postContentRef}>
          <div className="mt-1">
            <p className="mb-2">{e.caption}</p>
          </div>
          {e.meme_path.length !== 0 && (
            <div className="relative w-full flex justify-center items-center sm:w-[400px]">
              {e.meme_path.length > 1 && (
                <>
                  <div
                    className="absolute z-[50] left-2 bg-slate-100/50 dark:bg-transparent p-1 rounded-md"
                    onClick={handleMemePathIndex}
                  >
                    <PiCaretLeft />
                  </div>
                  <div
                    className="absolute z-[50] right-2 bg-slate-100/50 dark:bg-transparent p-1 rounded-md"
                    onClick={handleMemePathIndex}
                  >
                    <PiCaretRight />
                  </div>
                  <div className="bg-slate-100/50 dark:bg-transparent px-1 absolute top-1 right-1 z-50 rounded-md">
                    <span className="text-xs black dark:white">
                      {memePathIndex + 1}/{e.meme_path.length}
                    </span>
                  </div>
                </>
              )}

              {e.meme_path[memePathIndex].includes("video") ? (
                <video
                  src={e.meme_path[memePathIndex]}
                  controls
                  loop
                  className="max-w-[400px] max-sm:max-w-[300px] rounded-md"
                />
              ) : (
                <Image
                  src={e.meme_path[memePathIndex]}
                  isBlurred
                  alt="meme"
                  radius="sm"
                  loading="eager"
                  hidden={!e.meme_path}
                  className={`max-w-[400px] max-sm:max-w-[300px]`}
                />
              )}
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-between">
          <div className="flex-col justify-center items-center">
            <div
              className="flex items-center px-1 py-1 rounded-md transition duration-200 hover:bg-slate-200
         dark:hover:bg-gray dark:hover:bg-opacity-10 p-1"
            >
              <Button
                size="sm"
                isIconOnly
                radius="md"
                variant="light"
                aria-label="Up vote"
                className="data-[hover=true]:bg-transparent"
                onMouseEnter={() => setIsHoveredUp(true)}
                onMouseLeave={() => setIsHoveredUp(false)}
                onClick={() => {
                  if (!isClickedUp) {
                    setIsClickedUp(true);
                    handleVote(e.id, 1);
                  } else {
                    setIsClickedUp(false);
                    discontinueVote({
                      variables: { postId: e.id, userId, value: -1 },
                    });
                    setPostVote(postVote - 1);
                  }
                }}
              >
                {isClickedUp ? (
                  <PiArrowFatUpFill
                    size={18}
                    color={"green"}
                    className="transition duration-200 animate-[slide-top_2s_ease-in-out]"
                  />
                ) : (
                  <PiArrowFatUp
                    size={18}
                    color={isHoveredUp ? "green" : undefined}
                    className="transition duration-200"
                  />
                )}
              </Button>

              <span className="text-sm px-1 max-sm:px-[0.17rem]">
                {postVote}
              </span>

              <Button
                size="sm"
                isIconOnly
                radius="md"
                variant="light"
                aria-label="Down vote"
                className="data-[hover=true]:bg-transparent"
                onMouseEnter={() => setIsHoveredDown(true)}
                onMouseLeave={() => setIsHoveredDown(false)}
                onClick={() => {
                  if (!isClickedDown) {
                    setIsClickedDown(true);
                    handleVote(e.id, -1);
                  } else {
                    setIsClickedDown(false);
                    discontinueVote({
                      variables: { postId: e.id, userId, value: 1 },
                    });
                    setPostVote(postVote + 1);
                  }
                }}
              >
                {isClickedDown ? (
                  <PiArrowFatDownFill
                    size={18}
                    color={"red"}
                    className="transition duration-200"
                  />
                ) : (
                  <PiArrowFatDown
                    size={18}
                    color={isHoveredDown ? "red" : undefined}
                    className="transition duration-200"
                  />
                )}
              </Button>
            </div>
            <div className="text-xs text-center">{e.totalVotes} votes</div>
          </div>

          <Tooltip content="Comment" size="sm" delay={1000} placement="bottom">
            <Button
              size="md"
              radius="md"
              variant="light"
              aria-label="comments"
              className="px-1 rounded-md transition duration-200 data-[hover=true]:bg-slate-200 dark:hover:bg-gray
           dark:hover:bg-opacity-10"
              onMouseEnter={() => setIsHoveredComment(true)}
              onMouseLeave={() => setIsHoveredComment(false)}
              onPress={() => {
                setIsClickedComment(true);
                onOpen();
              }}
            >
              <PiUsersThree
                size={18}
                color={isHoveredComment ? "purple" : undefined}
              />
              <span className="text-sm px-1">{e.aggregateComments}</span>
            </Button>
          </Tooltip>

          <Popover
            showArrow
            placement="bottom"
            classNames={{
              base: "w-[10rem]",
            }}
            isOpen={isClickedTag}
            onOpenChange={(open) => setIsClickedTag(open)}
          >
            <PopoverTrigger>
              <Button
                size="md"
                isIconOnly
                radius="md"
                variant="light"
                aria-label="comments"
                className=" rounded-md transition duration-200 data-[hover=true]:bg-slate-200 dark:hover:bg-gray
              dark:hover:bg-opacity-10"
                onMouseEnter={() => setIsHoveredShare(true)}
                onMouseLeave={() => setIsHoveredShare(false)}
              >
                <PiPolygon
                  size={18}
                  color={isHoveredShare ? "#005898" : undefined}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <div
                className="w-full max-w-[260px] p-1 border-small rounded-small border-default-200 dark:border-default-100
              text-black dark:text-white"
              >
                <Listbox
                  topContent={topContent}
                  classNames={{
                    base: "max-w-xs px-0",
                    list: "max-h-[250px] overflow-x-hidden px-0",
                  }}
                  items={searchResults.data?.searchFollowerUsers ?? []}
                  label="Tag to"
                  selectionMode="multiple"
                  onSelectionChange={(keys: any) => setValues(keys)}
                  selectedKeys={values}
                >
                  {(item: any) => {
                    return (
                      <ListboxItem
                        key={item.User.id}
                        textValue={item.User.username}
                        className="py-[0.15rem] px-0"
                      >
                        <div className="flex gap-2 items-center px-0">
                          <Avatar
                            size="sm"
                            alt={item.User.full_name}
                            src={
                              item.User.profile_picture ?? "/images/user.png"
                            }
                            placeholder="images/user.png"
                            // src={item.User.profile_picture ?? "/images/user.png"}
                          />
                          <div className="flex flex-col">
                            <span className=" text-xs">
                              {item.User.full_name}
                            </span>
                            <span className="text-tiny text-default-400">
                              @{item.User.username}
                            </span>
                          </div>
                        </div>
                      </ListboxItem>
                    );
                  }}
                </Listbox>
                <Button
                  className="w-full h-[1.7rem] text-xs"
                  isLoading={tagPostLoading ?? false}
                  onClick={() => handleTag(e.id, arrayValues)}
                  radius="sm"
                  color="primary"
                >
                  Tag
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-2 text-sm text-default-500">
          {e.total_views} views
        </div>

        <Share
          isOpen={shareDisclosure.isOpen}
          onOpenChange={shareDisclosure.onOpenChange}
          postId={e.id}
        />
        <CommentModalComponent
          isClickedComment={isClickedComment}
          setIsClickedComment={setIsClickedComment}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          {...meme}
        />
      </div>
    </>
  );
};

export default PostCard;

// comment modal
const CommentModalComponent = (props: any) => {
  const [commentText, setCommentText] = useState("");

  const [userId, setUserId] = useState<undefined | String>(undefined);

  useEffect(() => {
    getUserId().then((id) => setUserId(id));
  }, []);

  const Comments = useQuery(
    gql`
      query Query($postId: ID!, $userId: ID!) {
        getComments(postId: $postId, userId: $userId) {
          comment
          id
          votes
          created_at
          user {
            id
            username
            profile_picture
          }
          commentvote {
            vote
          }
        }
      }
    `,
    {
      variables: { postId: props.id, userId },
      skip: !props.isOpen || userId === undefined || !userId,
    }
  );

  useEffect(() => {
    if (props.isOpen) {
      Comments.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  const [textComment, { data: data }] = useMutation(gql`
    mutation Mutation($postId: ID!, $userId: ID!, $comment: String!) {
      textComment(postId: $postId, userId: $userId, comment: $comment)
    }
  `);

  // its takes a parameter postId (at which post you are commenting the text) , userId (who's trying to comment ) , comment (text)
  const handleComment = (postId: string, comment: string) => (e: any) => {
    e.preventDefault();
    textComment({
      variables: {
        postId,
        userId,
        comment,
      },
    });
    setCommentText("");
  };

  useEffect(() => {
    if (data?.textComment) {
      Comments.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Modal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      radius="md"
      scrollBehavior="inside"
      isDismissable={false}
      id="comment-modal"
      classNames={{
        body: "mb-[4.5rem]",
        backdrop: "bg-white/10 backdrop-opacity-10",
        base: "bg-white dark:bg-black text-black dark:text-white",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Comments</ModalHeader>
            <ModalBody className="p-1">
              {/* {!Comments.loading && ( */}
              <div className="flex-col min-h-[250px]">
                {/* //TODO: fix the infinite scroll */}
                {/* <InfiniteScroll
                  dataLength={Comments.data?.getComments.edges.length ?? 0}
                  next={() => {
                    Comments.fetchMore({
                      variables: {
                        offset: Comments.data
                          ? Comments.data?.getComments?.edges.length
                          : 0,
                        postId: props.id,
                        userId,
                      },
                      updateQuery(previousQueryResult, { fetchMoreResult }) {
                        if (!fetchMoreResult) return previousQueryResult;
                        return {
                          ...previousQueryResult,
                          getComments: {
                            ...previousQueryResult.getComments,
                            edges: [
                              ...previousQueryResult.getComments.edges,
                              ...fetchMoreResult.getComments.edges,
                            ],
                            hasFetchMore:
                              fetchMoreResult.getComments.hasFetchMore,
                          },
                        };
                      },
                    });
                  }}
                  hasMore={Comments.data?.getComments.hasFetchMore}
                  loader={
                    <div className="flex justify-center mb-[2rem]">
                      <Spinner color="primary" size="sm" />
                    </div>
                  }
                > */}
                <div className="relative w-full">
                  {Comments.data?.getComments.map((comment: any) => {
                    return <CommentCard key={comment.id} comment={comment} />;
                  })}
                </div>
                {/* </InfiniteScroll> */}
                <div className="absolute bg-light dark:bg-black bottom-0 right-0 left-0 p-2">
                  <Input
                    placeholder="Add a comment..."
                    variant="underlined"
                    size="sm"
                    className="mt-2 z-20 mb-2"
                    onChange={(e) => setCommentText(e.target.value)}
                    value={commentText}
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        handleComment(props.id, commentText);
                      }
                    }}
                    endContent={
                      <Button
                        className="bg-transparent"
                        isIconOnly
                        onClick={handleComment(props.id, commentText)}
                      >
                        <PiExport size={18} />
                      </Button>
                    }
                  />
                </div>
              </div>
              {/* )} */}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const CommentCard = (props: any) => {
  const [isClickedUp, setIsClickedUp] = useState(false);
  const [isClickedDown, setIsClickedDown] = useState(false);

  const [commentVote, setCommentVote] = useState(0);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const [castVote] = useMutation(gql`
    mutation Mutation($commentId: ID!, $vote: Int!, $userId: ID!) {
      castCommentVote(commentId: $commentId, vote: $vote, userId: $userId)
    }
  `);

  const [discontinueVote] = useMutation(gql`
    mutation Mutation($commentId: ID!, $userId: ID!, $vote: Int!) {
      discontinueCommentVote(
        commentId: $commentId
        userId: $userId
        vote: $vote
      )
    }
  `);
  const handleVote = (commentId: string, userId: any, vote: number) => {
    if (vote === 1) {
      if (isClickedUp) {
        setIsClickedUp(false);
        discontinueVote({ variables: { commentId, userId, vote: -1 } });
        setCommentVote((prevVote) => prevVote - 1);
      } else {
        if (isClickedDown) {
          setIsClickedDown(false);
          discontinueVote({ variables: { commentId, userId, vote: 1 } });
          setCommentVote((prevVote) => prevVote + 1);
        }
        setIsClickedUp(true);
        castVote({ variables: { commentId, userId, vote } });
        setCommentVote((prevVote) => prevVote + 1);
      }
    }

    if (vote === -1) {
      if (isClickedDown) {
        setIsClickedDown(false);
        discontinueVote({ variables: { commentId, userId, vote: 1 } });
        setCommentVote((prevVote) => prevVote + 1);
      } else {
        if (isClickedUp) {
          setIsClickedUp(false);
          discontinueVote({ variables: { commentId, userId, vote: -1 } });
          setCommentVote((prevVote) => prevVote - 1);
        }
        setIsClickedDown(true);
        castVote({ variables: { commentId, userId, vote } });
        setCommentVote((prevVote) => prevVote - 1);
      }
    }
  };

  useEffect(() => {
    if (props.comment.commentvote?.length > 0) {
      if (props.comment.commentvote[0].vote === 1) {
        setIsClickedUp(true);
      } else if (props.comment.commentvote[0].vote === -1) {
        setIsClickedDown(true);
      }
    }
  }, [props]);

  useEffect(() => {
    setCommentVote(props.comment.votes);
  }, [props.comment.votes]);

  useEffect(() => {
    getUserId().then((id: any) => setUserId(id));
  }, []);

  return (
    <div className={"flex justify-between mt-2 w-full select-none"}>
      <div className="flex">
        <Avatar
          size={"sm"}
          src={props.comment.user?.profile_picture ?? "/images/user.png"}
        />
        <div className="flex-col">
          <div className={"ml-2 flex items-center"}>
            <div className={"text-[12px] text-default-500"}>
              @{props.comment.user.username}
            </div>
            <h6 className="text-[10px] mx-2 text-default-600">
              {timeAgo(parseInt(props.comment.created_at))}
            </h6>
          </div>
          <p className="mx-2 my-[0.25rem] text-[0.8rem] break-words">
            {props.comment.comment}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          size="sm"
          isIconOnly
          radius="md"
          variant="light"
          aria-label="Up vote"
          className="data-[hover=true]:bg-transparent"
          onClick={() => {
            if (!isClickedUp) {
              setIsClickedUp(true);
              handleVote(props.comment.id, userId, 1);
            } else {
              setIsClickedUp(false);
              discontinueVote({
                variables: {
                  commentId: props.comment.id,
                  userId: userId,
                  vote: -1,
                },
              });
              setCommentVote((prevVote) => prevVote - 1);
            }
          }}
        >
          {isClickedUp ? (
            <PiArrowFatUpFill
              size={16}
              color={"green"}
              className="transition duration-200 animate-[slide-top_2s_ease-in-out]"
            />
          ) : (
            <PiArrowFatUp size={16} className="transition duration-200" />
          )}
        </Button>
        <span className="text-sm px-1">{commentVote}</span>
        <Button
          size="sm"
          isIconOnly
          radius="md"
          variant="light"
          aria-label="Down vote"
          className="data-[hover=true]:bg-transparent"
          onClick={() => {
            if (!isClickedDown) {
              setIsClickedDown(true);
              handleVote(props.comment.id, userId, -1);
            } else {
              setIsClickedDown(false);
              discontinueVote({
                variables: {
                  commentId: props.comment.id,
                  userId: userId,
                  vote: 1,
                },
              });
              setCommentVote((prevVote) => prevVote + 1);
            }
          }}
        >
          {isClickedDown ? (
            <PiArrowFatDownFill
              size={16}
              color={"red"}
              className="transition duration-200"
            />
          ) : (
            <PiArrowFatDown size={16} className="transition duration-200" />
          )}
        </Button>
      </div>
    </div>
  );
};

const useOnScreen = (options: any) => {
  const ref = useRef();
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, isIntersecting];
};
