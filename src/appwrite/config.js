import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featured_image, status, userID }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseaID, 
                conf.appwriteCollectionID,
                ID.unique(), // ✅ Always unique
                {
                    title,
                    content,
                    featured_image: featured_image || "", // ✅ Ensure it's never undefined
                    status,
                    userID,
                }
            );
        } catch (error) {
            console.error("❌ Appwrite Service :: createPost :: Error", error);
            return false;
        }
    }
    

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseaID,
                conf.appwriteCollectionID,
                slug,
                {
                    title,
                    content,
                    featured_image: featuredImage, // ✅ Ensure consistency
                    status,
                }
            );
        } catch (error) {
            console.error("❌ Appwrite Service :: updatePost :: Error", error);
            return false;
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseaID,
                conf.appwriteCollectionID,
                slug
            );
            return true;
        } catch (error) {
            console.error("❌ Appwrite Service :: deletePost :: Error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseaID, 
                conf.appwriteCollectionID, 
                slug // Ensure this is the correct ID!
            );
        } catch (error) {
            console.error("❌ Appwrite Service :: getPost :: Error", error);
            return null; // Return null instead of breaking the app
        }
    }
    

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseaID,
                conf.appwriteCollectionID,
                queries
            );
        } catch (error) {
            console.error("❌ Appwrite Service :: getPosts :: Error", error);
            return false;
        }
    }

    // ✅ File Upload Service
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketID,
                ID.unique(),
                file
            );
        } catch (error) {
            console.error("❌ Appwrite Service :: uploadFile :: Error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketID, fileId);
            return true;
        } catch (error) {
            console.error("❌ Appwrite Service :: deleteFile :: Error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        if (!fileId) {
            console.warn("⚠️ No fileId provided, using placeholder image.");
            return "https://via.placeholder.com/600x400?text=No+Image";
        }
        return this.bucket.getFilePreview(conf.appwriteBucketID, fileId);
    }
}

const service = new Service();
export default service;
