import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../components";
import appwriteService from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    // ✅ Function to transform title into slug format
    const slugTransform = useCallback((value) => {
        return value
            ? value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
            : "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title));
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [watch, slugTransform, setValue, getValues]);

    const submit = async (data) => {
        try {
            let fileId = post?.featured_image || ""; // ✅ Keep old image if editing
    
            // ✅ Upload new image if provided
            if (data.image?.[0]) {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    fileId = file.$id;
                } else {
                    console.error("❌ File upload failed!");
                    alert("Error: Could not upload image.");
                    return;
                }
            }
    
            // ✅ Ensure `featured_image` is properly set
            if (!fileId) {
                alert("Error: A featured image is required!");
                console.error("❌ No fileId found!");
                return;
            }
    
            // ✅ Ensure `userID` matches Appwrite's expected structure
            const newData = {
                title: data.title,
                slug: data.slug,
                content: data.content,
                featured_image: fileId, // ✅ Matches Appwrite schema
                status: data.status,
                userID: userData?.$id, // ✅ Fix userID casing
            };
    
            console.log("🟢 Submitting Post Data:", newData); // ✅ Debugging Log
    
            const dbPost = post
                ? await appwriteService.updatePost(post.$id, newData)
                : await appwriteService.createPost(newData);
    
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            } else {
                console.error("❌ Failed to create/update post");
                alert("Error: Failed to create/update the post.");
            }
        } catch (error) {
            console.error("❌ Error submitting post:", error);
            alert("Error: Something went wrong. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="grid grid-cols-3 gap-6 p-6">
            {/* Left Section (2/3 width) */}
            <div className="col-span-2 space-y-4">
                <Input
                    label="Title :"
                    placeholder="Enter blog title"
                    className="w-full"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Auto-generated slug"
                    className="w-full"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value));
                    }}
                />
                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />
            </div>

            {/* Right Section (1/3 width) */}
            <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow-md">
                <label className="text-gray-700 font-semibold block">Featured Image</label>
                <Input
                    type="file"
                    className="w-full"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image")}
                />
                {post?.featured_image && (
                    <div className="w-full">
                        <img
                            src={appwriteService.getFilePreview(post.featured_image)}
                            alt="Post Image"
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Post Status"
                    className="w-full cursor-pointer"
                    {...register("status", { required: true })}
                />
                <Button
                    type="submit"
                    className={`w-full cursor-pointer py-2 text-lg font-semibold rounded-lg ${
                        post ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                    } text-white transition duration-300`}
                >
                    {post ? "Update Post" : "Publish Post"}
                </Button>
            </div>
        </form>
    );
}
