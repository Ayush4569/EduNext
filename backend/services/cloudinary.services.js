import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzmb718aw',
    api_key: process.env.CLOUDINARY_API_KEY || '115896662838791',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'aj5N_R0SogxIBF7kuksJgCHuxLE',
  });

export const uploadToCloudinary = async(imagePath)=>{
    try {
        if(!imagePath) return new Error('Image path is required')
        const response = await cloudinary.uploader.upload(imagePath,{resource_type:'auto'})
        await fs.promises.unlink(imagePath)
        return response.url
    } catch (error) {
        await fs.promises.unlink(imagePath)
        console.log(error);
    }
}

