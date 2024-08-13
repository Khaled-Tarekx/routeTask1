import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
	api_secret: process.env.CLOUDINARY_SECRET,
	api_key: process.env.CLOUDINARY_KEY,
	cloud_name: process.env.CLOUDINARY_NAME,
});

export default cloudinary;
