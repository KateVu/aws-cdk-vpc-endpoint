# aws-cdk-vpc-endpoint
Deploy endpoints for vpc via aws-cdk.

## Getting started
### Prequisition: 
- Deploy vpc. Please refer to https://github.com/KateVu/aws-cdk-vpc
### How to deploy
- Obtain aws credential for the aws account (check ~/.aws/credential or ~/.aws/cli/cache)
- export your environment variable if you do not want to use the default one. This variable is used in bin/index.ts
- synth: cdk synth
- deploy: cdk deploy
- destroy: cdk destroy
