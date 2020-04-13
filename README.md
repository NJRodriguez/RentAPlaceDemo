# RentAPlaceDemo

## Pulumi Setup
To create the infrastructure you must have Pulumi downloaded and configured along with AWS CLI.

https://www.pulumi.com/docs/get-started/install/
https://aws.amazon.com/cli/

## Deploy Stack
To deploy the stack cd into `./pulumi` and run the following commands:

`pulumi stack init dev`
(Stack name must be equal to the project's stack name: `dev`)

This will prompt a Login where you must enter your Pulumi credentials.

`pulumi up`

If AWS CLI is configured correctly, this will show you a preview of the resources to be created on your AWS account. Once accepted, these resources will be created and deployed on AWS. At the end of the process, a website url will be exported to be able to access the static website hosted on S3, along with an RDS Endpoint for accessing the Database directly.