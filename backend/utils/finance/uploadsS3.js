const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Generate presigned URL for secure access (expires in 1 hour by default)
const getPresignedUrl = async (key, expiresIn = 3600) => {
  if (!key) return null;
  
  const bucketName = process.env.AWS_S3_BUCKET_NAME || "mnt-ecommerce-2025";
  
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    
    // Generate presigned URL that expires in specified seconds
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
};

module.exports = { getPresignedUrl };
