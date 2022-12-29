#!/bin/bash

npm install bower
npm install typescript

cp -RT src/main/webapp build
rm -rf build/WEB-INF

npx tsc
npx bower install

cp -R bower_components build/bower_components


