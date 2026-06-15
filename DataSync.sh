#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo
    echo "[ERROR] Folder isnt a github repo"
    read -rp "Enter to exit"
    exit 1
fi

repo_name=$(basename "$(git rev-parse --show-toplevel)")
current_time=$(date '+%d/%m/%Y %H:%M:%S')
commitmsg="[$repo_name] $current_time"

echo
echo "========================================"
echo "Repository : $repo_name"
echo "Time       : $current_time"
echo "========================================"

git add .

git commit -m "$commitmsg"

git push

echo
echo "========================================"
echo "DATA SYNC COMPLETE"
echo "Repository : $repo_name"
echo "Commit     : $commitmsg"
echo "Time       : $(date '+%d/%m/%Y %H:%M:%S')"
echo "========================================"

read -rp "Enter to exit"
