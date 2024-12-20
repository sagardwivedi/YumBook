import { useCallback } from "react";

type UseSharePostResult = {
  sharePost: () => void;
  postLink: string;
};

const useSharePost = (postId: string): UseSharePostResult => {
  // Generate the post link dynamically
  const postLink = `http://localhost:3000/p/${postId}`;

  // Function to handle the sharing process
  const sharePost = useCallback(() => {
    // Check if the browser supports the native share API (mainly for mobile)
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post!",
          url: postLink,
        })
        .then(() => {
          console.log("Post shared successfully!");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      // Fallback for browsers that don't support native sharing (e.g., desktop browsers)
      navigator.clipboard
        .writeText(postLink)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch((error) => {
          console.error("Error copying the link:", error);
        });
    }
  }, [postLink]);

  return { sharePost, postLink };
};

export default useSharePost;
