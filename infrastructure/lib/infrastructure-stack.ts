import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { InstanceTagSet, ServerApplication, ServerDeploymentConfig, ServerDeploymentGroup } from 'aws-cdk-lib/aws-codedeploy';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeDeployEcsDeployAction, CodeDeployServerDeployAction, GitHubSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { AmazonLinuxGeneration, Instance, InstanceClass, InstanceSize, InstanceType, MachineImage, Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { EC2_TAG_NAME, EC2_TAG_VALUE } from '../bin/infrastructure';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const defaultVpc = Vpc.fromLookup(this, 'VPC', { isDefault: true });

    const ec2Role = new Role(this, 'ec2-role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      description: 'EC2 Instance for grab scrap backend',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AWSCodeDeployFullAccess')
      ],
    });

    const ec2SecurityGroup = new SecurityGroup(this, 'ec2-sg', {
      vpc: defaultVpc,
      allowAllOutbound: true,
      securityGroupName: 'ec2-sg'
    });

    ec2SecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(80),
      'Allow HTTP access from the Internet'
    );

    ec2SecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(22),
      'Allow SSH access from the internet'
    );

    // create ec2 instance(t2 micro)
    const ec2Instance = new Instance(this, 'ec2-instance', {
      vpc: defaultVpc,
      role: ec2Role,
      securityGroup: ec2SecurityGroup,
      instanceName: 'grab-scrap-backend',
      instanceType: InstanceType.of(
        InstanceClass.T2,
        InstanceSize.MICRO
      ),
      machineImage: MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
    });

    const userScript = readFileSync('./lib/userData.sh', 'utf8');
    ec2Instance.addUserData(userScript);

    const app = new ServerApplication(this, 'codedeploy-app', {
      applicationName: 'grab-scrap-backend'
    });

    const deploymentGroup = new ServerDeploymentGroup(this, 'grab-scrap-dg', {
      application: app,
      deploymentGroupName: 'grab-scrap-dg',
      deploymentConfig: ServerDeploymentConfig.ALL_AT_ONCE,
      ec2InstanceTags: new InstanceTagSet({
        [EC2_TAG_NAME]: [EC2_TAG_VALUE]
      }),
      installAgent: true
    });

    const codePipeline = new Pipeline(this, 'grab-scrap-pipeline', {
      pipelineName: 'grab-scrap-pipeline'
    });

    const githubArtifact = new Artifact();

    // adds github source stage and its action
    const githubAction = new GitHubSourceAction({
      actionName: 'Github-Source',
      owner: 'takshch',
      repo: 'grab-scrap',
      oauthToken: SecretValue.secretsManager('github-token'),
      output: githubArtifact,
      branch: 'main',
    });

    codePipeline.addStage({
      stageName: 'source',
      actions: [githubAction]
    });

    // adds code deploy stage and its action
    const deployAction = new CodeDeployServerDeployAction({
      actionName: 'deploy-to-ec2',
      input: githubArtifact,
      deploymentGroup,
    });

    codePipeline.addStage({
      stageName: 'pipeline',
      actions: [deployAction]
    });
  }
}
