import mongoose from "mongoose";

// dbConnection function to connect to MongoDB
export const dbConnection = () => {
    // Establishing a connection to the MongoDB database
    mongoose.connect(process.env.MONGO_URI, {
        // Specifying the database name to use within MongoDB
        dbName: "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM",
    })
    // If the connection is successful
    .then(() => {
        console.log("✅ Database connected successfully");
    })
    // If there is an error during connection
    .catch((err) => {
        console.error("❌ Database connection failed");
        console.error(err.message); // Log the actual error for debugging
        process.exit(1); // Stop the app if the database connection fails
    });
};
