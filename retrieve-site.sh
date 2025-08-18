#!/bin/bash
REPO_DIR="x12862.github.io"
REPO_URL="git@github.com:x12862/x12862.github.io.git"

if [ ! -d "$REPO_DIR" ]; then
  echo "Cloning the repository..."
  git clone $REPO_URL
  cd $REPO_DIR
else
  cd $REPO_DIR
  echo "Pulling latest changes..."
  git pull origin main
fi

echo "Site retrieved successfully."
