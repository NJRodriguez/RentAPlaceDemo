import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as fs from "fs"
import * as mime from "mime"

// Create an AWS resource (S3 Bucket)
const s3Bucket = new aws.s3.Bucket("my-bucket", {
    website: {
        indexDocument: "index.html",
    },
});

let siteDir = "./web"; // directory for content files

// For each file in the directory, create an S3 object stored in `s3Bucket`
for (let item of fs.readdirSync(siteDir)) {
    let filePath = require("path").join(siteDir, item);
    let object = new aws.s3.BucketObject(item, {
      bucket: s3Bucket,
      source: new pulumi.asset.FileAsset(filePath),     // use FileAsset to point to a file
      contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
    });
}

// Create an S3 Bucket Policy to allow public read of all objects in bucket
function publicReadPolicyForBucket(bucketName: string) {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Principal: "*",
      Action: [
        "s3:GetObject"
      ],
      Resource: [
        `arn:aws:s3:::${bucketName}/*`
      ]
    }]
  })
}

// Set the access policy for the bucket so all objects are readable
let bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
  bucket: s3Bucket.bucket,
  policy: s3Bucket.bucket.apply(publicReadPolicyForBucket)
});

// Export the website endpoint
exports.websiteUrl = s3Bucket.websiteEndpoint;

// Export the name of the bucket
exports.bucketName = s3Bucket.bucket;