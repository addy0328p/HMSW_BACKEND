// Importing the Express app from app.js
import app from './app.js';
import cloudinary from 'cloudinary';


// Cloudinary ko configure kar rahe hain
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Cloudinary account ka cloud name, environment variable se liya jaa raha hai
    api_key: process.env.CLOUDINARY_API_KEY,        // Cloudinary API key, jo secure access ke liye use hoti hai
    api_secret: process.env.CLOUDINARY_API_SECRET,  // Cloudinary API secret key, jo API requests ko authenticate karta hai
});

// Starting the server on the port defined in the environment variables
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
