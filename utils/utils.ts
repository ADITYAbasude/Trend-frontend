import { parse } from "cookie";
import { formatDistanceToNow } from "date-fns";
export const getToken = (): Promise<String | undefined> => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window !== "undefined") {
        const token = parse(document.cookie).token;
        if (token === undefined) {
          reject(undefined);
        } else {
          resolve("Bearer " + token);
        }
      } else {
        reject(undefined);
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export const getUserId = (): Promise<String | undefined> => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window !== "undefined") {
        const id = parse(document.cookie).userId;
        
        if (id === undefined) {
          reject(undefined);
        } else {
          resolve(id);
        }
      } else {
        reject(undefined);
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export const timeAgo = (date: number) => {
  if (date === undefined) return "";
  return formatDistanceToNow(date, { addSuffix: true });
};
