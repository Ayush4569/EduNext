import {S3Client,PutObjectCommand,GetObjectCommand, DeleteObjectCommand} from 
"@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
export class AwsService {
  s3;
  constructor() {
    this.s3 = new S3Client({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: "v4",
    });
  }
  async uploadFile(fileName, filePath, fileType) {
    const fileContent = fs.createReadStream(filePath);
    try {
      const uploadedLink = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `videos/${fileName}`,
          Body: fileContent,
          ContentType: fileType,
          ACL: "private",
        })
      const response = await this.s3.send(uploadedLink);
      if (response) {
        await fs.promises.unlink(filePath);
        return response;
      }
    } catch (error) {
      console.log("Error uploading file to S3:", error);
      await fs.promises.unlink(filePath);
    }
  }

  async deleteFile(fileName) {
    try {
     const command =  new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `videos/${fileName}`,
        })
      await this.s3.send(command);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw new Error("Failed to delete file from S3");
    }
  }

  async generateSignedUrl(fileName) {
    try {
      const getObjectParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `videos/${fileName}`,
      };
      const command = new GetObjectCommand(getObjectParams);
      return await getSignedUrl(this.s3,command,{expiresIn: 600});
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error("Failed to generate signed URL");
    }
  }
}
const awsService = new AwsService();
export default awsService;
