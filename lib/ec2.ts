import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as iam from 'aws-cdk-lib/aws-iam'



interface Ec2StackPros extends StackProps {
    region: string,
    accountId: string,
    accountName: string,
    envName: string,
}


export class Ec2InstanceStack extends Stack {
    constructor(scope: Construct, id: string, props: Ec2StackPros) {
        const { region, accountId, accountName } = props
        const updatedProps = {
            env: {
                region: region,
                account: accountId,
            },
            ...props
        }
        super(scope, id, updatedProps)

        const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
            vpcName: `vpc-${accountName}`
        })

        const sg = new ec2.SecurityGroup(this, 'security group', {
            vpc: vpc,
            description: 'security group for vpc endpoints'
        })

        sg.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(443), 'https within the vpc')

        const listS3Policy = new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        's3:ListBucket',
                    ],
                    resources: ['*'],
                })
            ]

        })

        const role = new iam.Role(
            this,
            'simple-instance-role', // this is a unique id that will represent this resource in a Cloudformation template
            {
                assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
                managedPolicies: [
                    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
                ],
                inlinePolicies: {
                    'listS3': listS3Policy
                }
            }
        )

        const Ec2Instance = new ec2.Instance(this, 'simple ec2', {
            vpc: vpc,
            role: role,
            securityGroup: sg,
            instanceName: 'test instance',
            instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
                ec2.InstanceClass.T2,
                ec2.InstanceSize.MICRO
            ),
            machineImage: ec2.MachineImage.latestAmazonLinux2({
            }),
        })
        new CfnOutput(this, `test instance`, {
            value: Ec2Instance.instanceId,
            exportName: `ec2-instance-id`
        })


    }
}