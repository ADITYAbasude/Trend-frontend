import axios from "axios";
import { create } from "zustand";
import { parse } from "cookie";

//* APP_API_BASE_URL is an environment variable that is set in .env file
//* APP_API_BASE_URL=http://localhost:5000/
const baseurl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
interface PostStore {
  successful: boolean;
  loadingStatus: boolean;
  memePostSuccessfully: boolean;
  message: string;
  createPost: (caption: string, memes: any, postTopics: any) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  convertGIF: (html: any) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  successful: false,
  loadingStatus: false,
  memePostSuccessfully: false,
  message: "",
  createPost: async (caption: string, memes: any, postTopics: any) => {
    try {
      set({ loadingStatus: true });
      const formData = new FormData();

      formData.append("caption", caption);

      if (memes.length > 0) {
        memes.map((meme: any) => {
          formData.append("files", meme);
        });

        if (postTopics.length > 0) {
          const pgArrayLiteral = `{${postTopics.join(",")}}`;
          formData.append("postTopics", pgArrayLiteral);
        }
      }
      await axios
        .post(`${baseurl}api/v1/post/create`, formData, {
          headers: {
            authorization: `Bearer ${parse(document.cookie).token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            set({
              message: response.data.message,
              successful: true,
              memePostSuccessfully: true,
            });
          } else {
            set({ message: response.data.message });
          }
        });
    } catch (error: any) {
      set({
        message: error.message,
        successful: false,
        memePostSuccessfully: false,
      });
    } finally {
      set({ loadingStatus: false, memePostSuccessfully: false });
    }
  },
  deletePost: async (postId: string) => {
    try {
      set({ loadingStatus: true });
      axios
        .delete(`${baseurl}api/v1/post/delete/${postId}`)
        .then((response) => {
          if (response.status === 200) {
            set({
              successful: true,
            });
          } else {
            set({ message: response.data.message });
          }
        });
    } catch (error: any) {
    } finally {
      set({ loadingStatus: false });
    }
  },
  convertGIF: async (html) => {

    // const canvas = new Canvas(500, 500);
    // const ctx = canvas.getContext("2d");

    // ctx.fillStyle = "white";
    // ctx.fillRect(0, 0, 500, 500);

    // ctx.drawImage(html, 0, 0, 500, 500);
    // ctx.getImageData(0, 0, 500, 500);
    // console.log(ctx.getImageData(0, 0, 500, 500));
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

    // await page.setContent(html);

    // const encoder = new GIFEncoder(500, 500); // Set the dimensions of the GIF
    // encoder.createReadStream(); // Remove the argument from the method call

    // encoder.start();
    // encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
    // encoder.setDelay(500); // frame delay in ms
    // encoder.setQuality(10); // image quality. 10 is default.

    // const screenshot: any = await page.screenshot({ encoding: "binary" });
    // encoder.addFrame(screenshot);

    // encoder.finish();

    // await browser.close();
  },
}));
