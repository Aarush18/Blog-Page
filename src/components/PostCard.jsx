import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featured_image }) {
  const imageUrl = featured_image
    ? appwriteService.getFilePreview(featured_image)
    : "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img src={imageUrl} alt={title} className="rounded-xl" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
