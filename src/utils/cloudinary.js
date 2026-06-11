import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

console.log("Before config:");
console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

console.log("Cloudinary Config:");
console.log(cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        console.log("Uploading:", localFilePath);
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
    console.log("========== CLOUDINARY ERROR ==========");
    console.error(error);

    if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
    }

    return null;
}
}



export {uploadOnCloudinary}