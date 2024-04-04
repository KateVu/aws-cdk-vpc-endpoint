# aws-cdk-vpc-endpoint
Deploy endpoints for vpc via aws-cdk. The list of gateways and interfaces endpoints are managed in config folder.
Deploy simple Ec2 instance in Data tier.

## Getting started
### Prerequisites: 
- a vpc has been deploy. Please refer to https://github.com/KateVu/aws-cdk-vpc
### Check file for mapping aws name and account
- Add if not exist /config/aws_account.yaml
- Content
```
- name: sandpit1
  account_id: "your aws account id"
```
Refer to Please refer to https://github.com/KateVu/aws-cdk-vpc for more detail
### Add services for endpoints
- syntax for file name: `<aws_account_name>-<region>-gateway-endpoint.yaml` and `<aws_account_name>-<region>-interface-endpoint.yaml`, create/update file and put it in config folder
- Two files with name sandpit1-ap-southeast-2-gateway-endpoints.yaml and sandpit1-ap-southeast-2-interfaces-endpoint.yaml have been created
### How to deploy
- Obtain aws credential for the aws account (check ~/.aws/credential or ~/.aws/cli/cache)
- export your environment variable if you do not want to use the default one. This variable is used in bin/index.ts
```
const envName = process.env.ENVIRONMENT_NAME || 'kate'
const accountName = process.env.ACCOUNT_NAME || 'sandpit1'
const region = process.env.REGION || 'ap-southeast-2'
```
- synth: cdk synth
- deploy: cdk deploy --all or cdk deploy StackName to deploy one stack
- destroy: cdk destroy --all 