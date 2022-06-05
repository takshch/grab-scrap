#!/bin/bash

sudo chmod -R 777 /home/ec2-user/server

cd "/home/ec2-user/server"

npm install

sudo pm2 start "npm run prod" --name=backend
sudo pm2 save
