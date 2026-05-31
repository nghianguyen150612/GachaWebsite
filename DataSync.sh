#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo
    echo "[ERROR] Thu muc nay khong phai Git repository."
    read -rp "Nhan Enter de thoat..."
    exit 1
fi

commitmsg="Auto Sync $(date '+%Y-%m-%d %H-%M')"

echo
echo "===== GIT ADD ====="
git add .

echo
echo "===== GIT COMMIT ====="
git commit -m "$commitmsg" || true

echo
echo "===== GIT PUSH ====="
git push

echo
echo "===== DONE ====="
echo "Commit Message: $commitmsg"

read -rp "Nhan Enter de thoat..."
