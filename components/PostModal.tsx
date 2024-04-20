import { usePostStore } from "@/stores/post.store";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Image,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { PiImageLight, PiX, PiXBold } from "react-icons/pi";
import { Loading } from ".";
import confetti from "canvas-confetti";

const PostModal = (props: any) => {
  const { isOpen, onOpenChange } = props;

  const { loadingStatus, successful, memePostSuccessfully } = usePostStore(
    (state) => state
  );

  const [fileList, setFileList] = useState([]);
  const [postTopic, setPostTopic] = useState([]);
  const [caption, setCaption] = useState("");
  const [currentTopic, setCurrentTopic] = useState<string>();
  const photoRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files;

    if (file.length <= 2) {
      setFileList(fileList.concat(Array.from(file)));
    }
  };

  const handleButtonClick = () => {
    photoRef.current?.click();
  };

  useEffect(() => {
    if (!isOpen) {
      setFileList([]);
    }
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (memePostSuccessfully) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [memePostSuccessfully]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      radius="md"
      scrollBehavior="inside"
      isDismissable={false}
      classNames={{
        body: "py-6",
        backdrop: "bg-white/10 backdrop-opacity-10",
        base: "bg-white dark:bg-black text-black dark:text-white",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Post a Meme
            </ModalHeader>
            <ModalBody>
              <Textarea
                variant={undefined}
                // className="bg-black"
                placeholder="Share a fun..."
                onChange={(e) => setCaption(e.target.value)}
              />

              <div className="grid grid-cols-2 relative gap-2 mt-2">
                {fileList.length > 0 &&
                  Array.from(fileList).map((file: File, index) => (
                    <div key={index} className="flex w-full ">
                      {file.type.includes("video") ? (
                        <video controls className="w-full h-full rounded-md">
                          <source src={URL.createObjectURL(file)} />
                        </video>
                      ) : file.type.includes("audio") ? (
                        <audio controls className="w-full h-full rounded-md">
                          <source src={URL.createObjectURL(file)} />
                        </audio>
                      ) : (
                        <Image
                          loading="lazy"
                          src={URL.createObjectURL(file)}
                          width={400}
                          height={400}
                          alt="Placeholder"
                        />
                      )}

                      <Button
                        className="relative z-[1000] top-1 right-10"
                        isIconOnly
                        radius="sm"
                        size="sm"
                        variant="flat"
                        onPress={() => {
                          setFileList(fileList.filter((_, i) => i !== index));
                        }}
                      >
                        <PiXBold color={"black"} size={18} />
                      </Button>
                    </div>
                  ))}
              </div>
              {fileList.length !== 0 && (
                <div className="w-full justify-center items-center">
                  <div className="flex my-2">
                    {Array.from(postTopic).map((tag: any, index: number) => (
                      <div
                        key={index}
                        className="flex p-1 items-center even:mx-1 justify-between bg-slate-200 
                      dark:bg-gray dark:bg-opacity-10 rounded-md text-sm"
                      >
                        <span>{tag}</span>
                        <PiX
                          className="ml-1"
                          size={12}
                          onClick={() => {
                            setPostTopic(
                              postTopic.filter((_, i) => i !== index)
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <Input
                    variant="bordered"
                    placeholder="Add topics.."
                    labelPlacement="outside"
                    value={currentTopic}
                    onKeyDown={(e: any) => {
                      if (
                        e.key === "Enter" &&
                        e.currentTarget.value.trim() !== ""
                      ) {
                        setPostTopic(postTopic.concat(e.currentTarget.value));
                        e.currentTarget.value = "";
                        setCurrentTopic("");
                      }
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCurrentTopic(e.target.value);
                    }}
                  />
                </div>
              )}

              {loadingStatus && (
                <div className="fixed h-full w-full top-[50%] bottom-[50%] left-[50%] right-[50%] translate-y-[-50%] translate-x-[-50%]">
                  <Loading />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                className="p-0"
                isIconOnly
                radius="sm"
                size="sm"
                variant="flat"
                onPress={handleButtonClick}
              >
                <PiImageLight size={18} />
              </Button>
              <Button
                color="primary"
                size="sm"
                onPress={() => {
                  usePostStore
                    .getState()
                    .createPost(caption, fileList!, postTopic!)
                    .then(() => {
                      setFileList([]);
                      setCaption("");
                      onClose();
                    });
                }}
              >
                Post
              </Button>
              <input
                type="file"
                ref={photoRef}
                multiple={true}
                accept="image/*,video/*,audio/*"
                className="hidden"
                onChange={handleFileChange}
                name="avatar"
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
