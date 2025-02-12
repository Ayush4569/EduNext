import aws from "aws-sdk";
import fs from "fs";

export class AwsService {
  s3;
  constructor() {
    this.s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-north-1',
      signatureVersion: "v4",
    });
  }
  async uploadFile(fileName, filePath, fileType) {
    const fileContent = fs.createReadStream(filePath);
    try {
      const uploadedLink = await this.s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `videos/${fileName}`,
          Body: fileContent,
          ContentType: fileType,
          ACL: "private",
        })
        .promise();
      if (uploadedLink) {
        await fs.promises.unlink(filePath);
        return uploadedLink;
      }
    } catch (error) {
      console.log("Error uploading file to S3:", error);
      await fs.promises.unlink(filePath);
    }
  }

  async deleteFile(fileName) {
    try {
      await this.s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `videos/${fileName}`,
        })
        .promise();
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw new Error("Failed to delete file from S3");
    }
  }

  async getSignedUrl(fileName) {
    try {
      const signedUrl = await this.s3.getSignedUrl("getObject", {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `videos/${fileName}`,
        Expires: 3600,
      });
      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error("Failed to generate signed URL");
    }
  }
}
const awsService = new AwsService();
export default awsService;
