#!/bin/bash

S3PATH="s3://hngr-icons/js/utm-passer.min.js"
uglifyjs --compress --mangle -- utm-passer.js > utm-passer.min.js
aws s3 cp utm-passer.min.js $S3PATH
