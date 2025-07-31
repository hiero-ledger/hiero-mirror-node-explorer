#!/bin/bash

TARGET_DIR=$(npm prefix)/sourcify-setup

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "❌️ Did not find the sourcify-setup directory under project root."
  echo "   --> Do not run this script directly and make sure to use the npm command sourcify:check-setup"
  exit 1
fi

##################################################
### CHECK /etc/hosts/setup

HOSTNAME="repository.local"
HOSTS_FILE="/etc/hosts"

# Check if the hostname is already mapped to 127.0.0.1
if grep -qE "^127\.0\.0\.1\s+.*\b${HOSTNAME}\b" "$HOSTS_FILE"; then
    echo "✅  Host ${HOSTNAME} is correctly mapped to 127.0.0.1 in $HOSTS_FILE."
    result=0
else
    echo "❌️ Host ${HOSTNAME} is NOT correctly mapped to 127.0.0.1 in /etc/hosts"
    echo "   --> Edit /etc/hosts or execute the following command:"
    echo "   sudo bash -c 'echo "127.0.0.1       repository.local" >> /etc/hosts'"
    result=1
fi

echo
##################################################
### CHECK VALID CERTIFICATE IN PLACE

DOMAIN="localhost"
DAYS=365
CERT_DIR="$TARGET_DIR/nginx/certificate"
CERT_FILE="$CERT_DIR/$DOMAIN.crt"
KEY_FILE="$CERT_DIR/$DOMAIN.key"

if [[ -f "$CERT_FILE" && -f "$KEY_FILE" ]]; then
  VALIDITY=$(openssl x509 -in "$CERT_FILE" -noout -dates)
  NOT_AFTER=$(echo "$VALIDITY" | grep "notAfter" | sed 's/notAfter=//')
  NOT_AFTER_EPOCH=$(date -j -f "%b %d %H:%M:%S %Y %Z" "$NOT_AFTER" +%s)
  CURRENT_EPOCH=$(date -j +%s)

  if [ "$NOT_AFTER_EPOCH" -ge "$CURRENT_EPOCH" ]; then
    echo "✅  Valid self-signed certificate for $DOMAIN is already installed"
    result=0
  else
    echo "❌️ Certificate is not valid"
    echo "   --> Clean up remaining files under:"
    echo "   $CERT_DIR/"
    result=1
  fi

elif [[ ! -f "$CERT_FILE" && -f "$KEY_FILE" ]]; then
  echo "❌️ Certificate file missing"
  echo "   --> Clean up remaining key file:"
  echo "   $KEY_FILE"
  result=1
elif [[ ! -f "$KEY_FILE" && -f "$CERT_FILE" ]]; then
  echo "❌️ Key file missing"
  echo "   --> Clean up remaining certificate file:"
  echo "   $CERT_FILE"
  result=1
else
  echo "✅  Generating self-signed certificate for $DOMAIN..."
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes -days "$DAYS" -newkey rsa:2048 \
      -keyout "$KEY_FILE" \
      -out "$CERT_FILE" \
      -subj "/CN=$DOMAIN"
  echo "   Certificate : $CERT_FILE"
  echo "   Private key : $KEY_FILE"
  result=0
fi

echo
##################################################
### CHECK WHETHER DOCKER IS RUNNING

if docker info > /dev/null 2>&1; then
  echo "✅  Docker is running"
    result=0
else
  echo "❌️ Docker is not running!"
  echo "   --> Make sure docker is running -- e.g. by starting Docker Desktop"
  result=1
fi

echo
##################################################
### CHECK WHETHER LOGGED INTO ghcr.io

if [[ $(cat ~/.docker/config.json | jq -r '.auths["ghcr.io"]? // empty') ]]; then
  echo "✅  You are logged into ghcr.io"
else
  echo "❌️ You are not logged into ghcr.io"
  echo "   --> Make sure you have created a Personal Access Token in your account on GitHub and execute the following:"
  echo "   echo <personal-access-token> | docker login ghcr.io -u <github-user-name> --password-stdin"
  exit 1
fi

exit $result
