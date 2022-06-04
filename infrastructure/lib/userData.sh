#!/bin/bash

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -

sudo yum install -y nodejs
sudo yum install -y nvm

sudo npm install -g pm2@latest -y

sudo yum install -y ruby
sudo yum install -y wget
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent start
