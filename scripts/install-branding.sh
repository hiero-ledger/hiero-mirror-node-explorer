#!/bin/bash

PROJECT_DIR=$(npm prefix)
if [[ ! -d "$PROJECT_DIR/public" ]]; then
  echo "❌️ Did not find the public directory under project root."
  echo "   --> Do not run this script directly and make sure to use the npm command install:branding"
  exit 1
fi

# Install possible assets customization
BRANDING_DIR="${BRANDING_LOCATION:-$PROJECT_DIR/branding}"
cp ${BRANDING_DIR}/public/* $PROJECT_DIR/public/ 2>/dev/null | :
cp -R ${BRANDING_DIR}/public/.well-known $PROJECT_DIR/public/ 2>/dev/null | :
cp ${BRANDING_DIR}/.env $PROJECT_DIR 2>/dev/null | :
cp ${BRANDING_DIR}/index.html $PROJECT_DIR 2>/dev/null | :
