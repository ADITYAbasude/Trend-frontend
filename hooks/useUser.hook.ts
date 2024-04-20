import { getToken, getUserId } from "@/utils/utils";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

const USER_QUERY = gql`
  query user($id: ID!, $yourId: ID!) {
    getUser(id: $id, yourId: $yourId) {
      id
      username
      full_name
      profile_picture
    }
  }
`;

const useUser = () => {
  const [id, setId] = useState<String | undefined>(undefined);

  useEffect(() => {
    getUserId().then((id) => {
      setId(id);
    });
  });

  const { data, loading, error, refetch, updateQuery } = useQuery(USER_QUERY, {
    variables: { id: id, yourId: id},
    skip: !id || id === "undefined" || id === undefined,
  });

  return { data, loading, error, refetch, updateQuery };
};
export default useUser;
