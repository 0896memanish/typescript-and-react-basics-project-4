import { ReactNode, useEffect, useState } from "react";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import blogPostImage from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage";

type RawBlogPostType = {
  userId: string;
  id: number;
  title: string;
  body: string;
};

function App() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function getPosts() {
      setIsLoading(true);
      try {
        const rawData = (await get(
          "https://jsonplaceholder.typicode.com/posts"
        )) as RawBlogPostType[];

        const blogPosts: BlogPost[] = rawData.map((rawBlogPost) => {
          return {
            id: rawBlogPost.id,
            title: rawBlogPost.title,
            text: rawBlogPost.body,
          };
        });

        setBlogPosts(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }

      setIsLoading(false);
    }

    getPosts();
  }, []);

  let component: ReactNode;

  if (error) {
    component = <ErrorMessage text={error}></ErrorMessage>;
  }

  if (blogPosts) {
    component = <BlogPosts posts={blogPosts}></BlogPosts>;
  }

  if (isLoading) {
    component = <p id="loading-fallback">Blogposts are loading...</p>;
  }

  return (
    <main>
      <img src={blogPostImage}></img>
      {component}
    </main>
  );
}

export default App;
