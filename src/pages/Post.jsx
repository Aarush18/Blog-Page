import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    console.log("Fetched post:", post);
                    setPost(post);
                } else {
                    console.warn("Post not found, redirecting...");
                    navigate("/");
                }
            }).catch((error) => {
                console.error("Error fetching post:", error);
                navigate("/");
            });
        } else {
            console.warn("Slug missing, redirecting...");
            navigate("/");
        }
    }, [slug, navigate]);

    console.log("Current userData:", userData);
    console.log("Checking isAuthor:", post?.userID, "===", userData?.$id);

    const isAuthor = post && userData ? post.userID === userData?.$id : false;

    const deletePost = () => {
        if (!post) return;

        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                if (post.featured_image) {
                    appwriteService.deleteFile(post.featured_image);
                }
                navigate("/");
            }
        }).catch((error) => console.error("Error deleting post:", error));
    };

    return post ? (
        <div className="py-8">
            <Container>
                {/* Featured Image Section */}
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={post.featured_image 
                            ? appwriteService.getFilePreview(post.featured_image) 
                            : "https://via.placeholder.com/600x400?text=No+Image"}
                        alt={post.title}
                        className="rounded-xl"
                    />
                    {isAuthor && (
                        <div className="absolute right-6 top-6 flex space-x-3">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                {/* Post Title */}
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>

                {/* Post Content */}
                <div className="browser-css">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}
