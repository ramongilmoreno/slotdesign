#!/bin/bash

# https://www.npmjs.com/package/http-server
npm install http-server

PORT=8080
echo Running HTTP server on port $PORT

npx http-server build -p $PORT

