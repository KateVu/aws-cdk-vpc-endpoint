import { CfnOutput, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { getEndpoints } from './utils';


interface VpcStackPros extends StackProps {
  region: string,
  accountId: string,
  accountName: string,
  envName: string,
  configFolder: string
}

export class AwsCdkVpcEndpointStack extends Stack {
  constructor(scope: Construct, id: string, props: VpcStackPros) {
    const { region, accountId, accountName, configFolder } = props
    const updatedProps = {
      env: {
        region: region,
        account: accountId,
      },
      ...props
    }
    super(scope, id, updatedProps)

    //Find our vpc, to use different options to find your vpc refer to https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.VpcLookupOptions.html
    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcName: `vpc-${accountName}`
    })

    const sg = new ec2.SecurityGroup(this, 'security group', {
      vpc: vpc,
      description: 'security group for vpc endpoints'
    })

    sg.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(443), 'https within the vpc')

    //Get fileConfigName: 
    const configFileNameGateway = `${accountName}-${region}-gateway-endpoints.yaml`
    const configFileNameInterface = `${accountName}-${region}-interface-endpoints.yaml`
    const gateways = getEndpoints(configFolder, configFileNameGateway)
    const interfaces = getEndpoints(configFolder, configFileNameInterface)

    // It is annoying that our vpcendpoints do not have name. 
    // Because there is an issue with tagging https://github.com/aws/aws-cdk/issues/19332, hope cfn team will fix it soon
    const wait = (): boolean => {
      gateways.forEach((service) => {
        const s3gateway = vpc.addGatewayEndpoint(`gateway-${service}`, {
          service: {
            name: `com.amazonaws.${region}.${service}`
          }
        })
        new CfnOutput(this, `VPC Gateway Endpoint ${service}`, {
          value: s3gateway.vpcEndpointId,
          exportName: `vpc-gateway-endpoint-${service}`
        })
      })
      return true
    }

    if (wait()) {
      interfaces.forEach((service) => {
        const s3interface = vpc.addInterfaceEndpoint(`interface-${service}`, {
          service: new ec2.InterfaceVpcEndpointService(`com.amazonaws.${region}.${service}`),
          privateDnsEnabled: true,
          subnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
          },
          securityGroups: [sg]
        })    
        new CfnOutput(this, `VPC Interface Endpoint ${service}`, {
          value: s3interface.vpcEndpointId,
          exportName: `vpc-interface-endpoint-${service}`
        })
      })

    }

  }
}
