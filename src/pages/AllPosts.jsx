import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService
      .getPosts([])
      .then((postsData) => {
        if (postsData) {
          console.log("🚀 Retrieved Posts:", postsData.documents); // Debugging log
          setPosts(postsData.documents);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching posts:", err);
      });
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              {/* ✅ Pass props correctly */}
              <PostCard 
                $id={post.$id} 
                title={post.title} 
                featured_image={post.featured_image} 
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
