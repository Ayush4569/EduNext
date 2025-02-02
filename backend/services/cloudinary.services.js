import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzmb718aw',
    api_key: process.env.CLOUDINARY_API_KEY || '115896662838791',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'aj5N_R0SogxIBF7kuksJgCHuxLE'
  });

export const uploadToCloudinary = async(localPath)=>{
    try {
        if(!localPath) return new Error('Asset local path is required')
        const response = await cloudinary.uploader.upload(localPath,{resource_type:'auto'})
        await fs.promises.unlink(localPath)
        return response.url
    } catch (error) {
        await fs.promises.unlink(localPath)
        console.log(error);
    }
}

export const deleteFromCloudinary = async(publicId)=>{
    try {
        if(!publicId) return new Error('Asset public id is required')
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Failed to delete image from Cloudinary');
}

}