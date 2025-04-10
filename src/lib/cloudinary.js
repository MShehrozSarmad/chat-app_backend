import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

console.log("api key is", process.env.CLOUDINARY_API_KEY);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
