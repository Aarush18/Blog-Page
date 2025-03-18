const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjID: String(import.meta.env.
        VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseaID: String(import.meta.env.
        VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionID: String(import.meta.env.
        VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketID: String(import.meta.env.
        VITE_APPWRITE_BUCKET_ID),
}

export default conf // This file is made as importing in app.jsx might lead to possible rendering problems eventually leading to a app crash 

console.log("DEBUG: ENV VARIABLES LOADED ✅");
console.log("Appwrite URL:", conf.appwriteUrl);
console.log("Project ID:", conf.appwriteProjID);
console.log("Database ID:", conf.appwriteDatabaseaID);
console.log("Collection ID:", conf.appwriteCollectionID);
console.log("Bucket ID:", conf.appwriteBucketID);
