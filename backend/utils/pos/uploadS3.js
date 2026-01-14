const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
require("dotenv").config();

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(file.originalname.toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed"));
};

// Multer upload configuration for images
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: imageFilter,
});

// Upload file to S3 (accepts file object from multer)
const uploadToS3 = async (file, folder = 'pos') => {
  const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME || "mnt-ecommerce-2025";

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return fileName;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

// Delete file from S3
const deleteFromS3 = async (fileUrl) => {
  try {
    let key = fileUrl;
    if (fileUrl.includes("amazonaws.com/")) {
      key = fileUrl.split("amazonaws.com/")[1];
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME || "mnt-ecommerce-2025";

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error(`Failed to delete file from S3: ${error.message}`);
  }
};

// Generate pre-signed URL
const getPresignedUrl = async (key, expiresIn = 3600) => {
  if (!key) return null;
  
  if (key.includes('X-Amz-Algorithm') || key.includes('X-Amz-Signature')) {
    return key;
  }
  
  if (key.startsWith('http://') || key.startsWith('https://')) {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || "mnt-ecommerce-2025";
    const region = process.env.AWS_REGION || "eu-north-1";
    const s3UrlPattern = new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/([^?]+)`);
    const match = key.match(s3UrlPattern);
    
    if (match) {
      key = match[1];
    } else {
      return key;
    }
  }
  
  const bucketName = process.env.AWS_S3_BUCKET_NAME || "mnt-ecommerce-2025";
  
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return null;
  }
};

module.exports = {
  upload,
  uploadToS3,
  deleteFromS3,
  getPresignedUrl,
  s3Client,
};
