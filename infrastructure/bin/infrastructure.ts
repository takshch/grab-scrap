#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { Tags } from 'aws-cdk-lib';

export const EC2_TAG_NAME = 'NAME';
export const EC2_TAG_VALUE = 'grab-scrap-ec2';
const ENV = { account: '337452540769', region: 'us-east-1' };

const app = new cdk.App();
const infrastructureStack = new InfrastructureStack(app, 'InfrastructureStack', {
  env: ENV
});

Tags.of(infrastructureStack).add(EC2_TAG_NAME, EC2_TAG_VALUE, {
  includeResourceTypes: ['AWS::EC2::Instance']
});
