#!/bin/bash

npm install bower
npm install typescript

cp -RT src/main/webapp build
rm -rf build/WEB-INF

npx tsc

#
# https://stackoverflow.com/questions/25672924/run-bower-from-root-user-its-possible-how
# Requires this "--allow-root" flag to let Docker container run this as root
#
npx bower --allow-root install

cp -R bower_components build/bower_components


