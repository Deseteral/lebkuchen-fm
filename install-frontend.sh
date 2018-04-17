#!/usr/bin/env bash

pwd
cd ./node_modules/lebkuchen-fm-frontend
npm i
npm run build
cd ../..
cp -R ./node_modules/lebkuchen-fm-frontend/build/* ./src/public/
