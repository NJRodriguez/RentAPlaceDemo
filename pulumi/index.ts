import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as fs from "fs"
import * as mime from "mime"
import * as path from "path"
import * as config from "./utils/config"

const urlReplaceString = "${API_URL}"

// Create an AWS resource (S3 Bucket)
const s3Bucket = new aws.s3.Bucket("my-bucket", {
    website: {
        indexDocument: "index.html",
    },
});

const iamForLambda = new aws.iam.Role("iamForLambda", {
    assumeRolePolicy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
`,
});

const csharpLambda = new aws.lambda.Function("aws-hellolambda-csharp", {
    runtime: aws.lambda.DotnetCore2d1Runtime,
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive("../src/RentAPlaceDemo/bin/Debug/netcoreapp2.1/publish"),
    }),
    timeout: 5,
    handler: "RentAPlaceDemo::Functions::PostAsync",
    role: iamForLambda.arn
});

const rds = new aws.rds.Instance("my-rds", {
  allocatedStorage: 20,
  engine: "sqlserver-ex",
  engineVersion: "14.00.3192.2.v1",
  instanceClass: "db.t2.micro",
  password: "foobarbaz",
  storageType: "gp2",
  username: "foo",
})

exports.rdsEndpoint = rds.endpoint;

// Define a new POST endpoint that just returns a 200 and "hello" in the body.
const api = new awsx.apigateway.API("my-apigateway", {
    routes: [{
        path: "/enter",
        method: "POST",
        eventHandler: csharpLambda,
        apiKeyRequired: false,
    },
    {
      path: "/enter",
      method: "OPTIONS",
      eventHandler: (req, ctx, cb) => {
          cb(undefined, {
              statusCode: 200,
              body: Buffer.from(JSON.stringify({ name: "AWS" }), "utf8").toString("base64"),
              isBase64Encoded: true,
              headers: { 
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
              },
          })
      }
  }],
    stageName: "v1"
})

api.url.apply(urlString => {
  let siteDir = "./web"; // directory for content files

  // For each file in the directory, create an S3 object stored in `s3Bucket`
  for (let item of fs.readdirSync(siteDir)) {
      let filePath = path.join(siteDir, item);
      if (fs.lstatSync(filePath).isDirectory()) {
        for (let nestedItem of fs.readdirSync(filePath)) {
          const nestedFilePath = path.join(filePath, nestedItem);
          const nestedFileName = `${item}/${nestedItem}`
          if (item === "js"){
            const updatedJsPath = config.replaceUrlInJsFile(nestedFilePath, urlReplaceString, urlString);
            const obj = createS3Object(nestedFileName, updatedJsPath);
            // Once object is created in S3, delete temporary file with replaced values
            obj.id.apply(() => {
              fs.unlinkSync(updatedJsPath);
            })
          }
          else {
            createS3Object(nestedFileName, nestedFilePath);
          }
        }
      }
      else {
        createS3Object(item, filePath);
      }
  }
})
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

function createS3Object(fileName: string, filePath: string) {
  return new aws.s3.BucketObject(fileName, {
    bucket: s3Bucket,
    source: new pulumi.asset.FileAsset(filePath),     // use FileAsset to point to a file
    contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
  });
}