#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkVpcEndpointStack } from '../lib/aws-cdk-vpc-endpoint-stack';
import { getAccountId } from '../lib/utils';
import { Ec2InstanceStack } from '../lib/ec2';

//Environment variable for yaml file path and file name
const configFolder = '../config/'
const accountFileName = 'aws_account.yaml'

//Set up default value
const envName = process.env.ENVIRONMENT_NAME || 'kate'
const accountName = process.env.ACCOUNT_NAME || 'sandpit1'
const region = process.env.REGION || 'ap-southeast-2'
const aws_account_id = process.env.AWS_ACCOUNT_ID || 'none'

//Get aws account id
let accountId = aws_account_id
if (aws_account_id == 'none') {
  accountId = getAccountId(accountName, configFolder, accountFileName)
}
const app = new cdk.App();
const vpcEndpointStack = new AwsCdkVpcEndpointStack(app, 'AwsCdkVpcEndpointStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  stackName: `vpc-endpoint-${envName}`,
  region: region,
  accountId: accountId,
  accountName: accountName,
  envName: envName,
  configFolder: configFolder

});

cdk.Tags.of(vpcEndpointStack).add('createdby', 'KateVu')
cdk.Tags.of(vpcEndpointStack).add('createdvia', 'AWS-CDK')
cdk.Tags.of(vpcEndpointStack).add('environment', envName)
cdk.Tags.of(vpcEndpointStack).add('repo', 'https://github.com/KateVu/aws-cdk-vpc-endpoint')
cdk.Tags.of(vpcEndpointStack).add('DONOTDELETE', 'true')