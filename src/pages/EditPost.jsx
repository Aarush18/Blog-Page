import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🆔 Slug Received:", slug); // ✅ Debugging

    if (slug) {
      appwriteService
        .getPost(slug)
        .then((postData) => {
          if (postData) {
            console.log("✅ Post Data in Edit Mode:", postData);
            console.log(
              "🖼 Featured Image in Edit Mode:",
              postData.featured_image || "No Image Found"
            );

            setPost({
              ...postData,
              featured_image: postData.featured_image || "", // ✅ Ensure this exists
            });
          } else {
            console.error("❌ Error: Post not found!");
            setTimeout(() => navigate("/not-found"), 2000); // ✅ Delay redirect
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching post:", error);
          setTimeout(() => navigate("/not-found"), 2000);
        });
    } else {
      console.warn("⚠️ Warning: No slug provided, redirecting...");
      setTimeout(() => navigate("/not-found"), 2000);
    }
  }, [slug, navigate]);

  if (!post) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center text-xl font-semibold text-red-500">
            Loading post...
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        <PostForm post={post} />
      </Container>
    </div>
  );
}

export default EditPost;
