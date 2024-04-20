import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Loading } from ".";
import { PiMagnifyingGlass } from "react-icons/pi";
import { gql, useQuery } from "@apollo/client";
import { SearchCard } from "./SearchCard";
import useUser from "@/hooks/useUser.hook";

const SearchModal = (props: any) => {
  const { isOpen, onOpenChange } = props;

  const { data } = useUser();
  const [search, setSearch] = useState("");

  const searchResults = useQuery(
    gql`
      query search($search: String!, $id: ID!) {
        searchUser(search: $search, id: $id) {
          id
          username
          full_name
          profile_picture
          Following
        }
      }
    `,
    {
      variables: { search: search, id: data?.getUser?.id },
      skip: !isOpen,
    }
  );

  useEffect(() => {
    if (isOpen) {
      searchResults.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const [recentSearches, setRecentSearches] = useState([] as string[]);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const storeSearch = (search: string) => {
    const searchData: any =
      localStorage.getItem("recentSearches") !== null
        ? JSON.parse(localStorage.getItem("recentSearches") as string)
        : [];
    setRecentSearches([...searchData, search]);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  };

  useEffect(() => {
    const searchData: any =
      localStorage.getItem("recentSearches") !== null
        ? JSON.parse(localStorage.getItem("recentSearches") as string)
        : [];

    setRecentSearches([...searchData]);
  }, []);

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
            <ModalHeader className={"flex flex-col gap-1"}>Search</ModalHeader>
            <ModalBody>
              <div>
                <div>
                  <Input
                    endContent={
                      <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        size="sm"
                        className={"data-[hover=true]:bg-transparent"}
                        onPress={() =>
                          storeSearch(searchRef.current?.value as string)
                        }
                      >
                        <PiMagnifyingGlass size={24} />
                      </Button>
                    }
                    radius="sm"
                    size="sm"
                    ref={searchRef}
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        storeSearch(e.target.value);
                        setSearch(e.target.value);
                      }
                    }}
                    onChange={(e: any) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
                <div
                  className={
                    "max-h-[250px] min-h-[250px] max-md:h-full w-full mt-2 "
                  }
                >
                  {searchResults.data != undefined &&
                    searchResults.data.searchUser != null &&
                    searchResults.data.searchUser.map(
                      (user: UserObject, index: number) => {
                        return <SearchCard key={index} {...user} {...data} />;
                      }
                    )}
                </div>
              </div>
              {false && (
                <div
                  className={
                    "fixed h-full w-full top-[50%] bottom-[50%] left-[50%] right-[50%] translate-y-[-50%] translate-x-[-50%]"
                  }
                >
                  <Loading />
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
