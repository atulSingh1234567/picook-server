
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image'
        });


        const originalWidth = response.width;
        const originalHeight = response.height;
        const publicId = response.public_id;
        const format = response.format;
        
        fs.unlinkSync(localFilePath); // Remove local file after upload

        const getTransformedUrl = (publicId, originalWidth, originalHeight, format) => {
            let width = Math.round(originalWidth*0.5);
            let height = Math.round(originalHeight*0.5);
            
            return cloudinary.url(publicId, {
                width,
                height,
                crop: 'scale', // Thumbnail crop to keep faces in focus
                quality: '100', // Preserve original quality
                format, // Use the original format
                secure: true, // Use HTTPS
            });
        };

        const transformedUrls = getTransformedUrl(publicId, originalWidth, originalHeight, format)

        return {
            original: response.secure_url,
            transformed: transformedUrls,
            publicId
        };

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); // Ensure cleanup
        return null;
    }
};


const deleteFromCloudinary = async (publicId)=>{
       try {
        console.log("public id of avatar" , publicId)
        const response = await cloudinary.uploader.destroy(publicId)
        console.log(response)
        return response;
       } catch (error) {
          console.log(error)
          return error
       }
       
}



export { uploadOnCloudinary , deleteFromCloudinary };
