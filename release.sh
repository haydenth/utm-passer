#!/bin/bash

S3PATH="s3://hngr-icons/js/utm-passer.min.js"
VERSION=`cat VERSION`
echo "//version=$VERSION" > utm-passer.min.js
uglifyjs --compress --mangle -- utm-passer.js >> utm-passer.min.js
aws s3 cp utm-passer.min.js $S3PATH

aws cloudfront create-invalidation --distribution-id "E28MNI4K0QJS6H" --paths "/js/utm-passer.min.js"

