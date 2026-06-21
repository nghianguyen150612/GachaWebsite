#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo
    echo "[LỖI] Thư mục này không phải kho Git."
    read -rp "Nhấn Enter để thoát"
    exit 1
fi

repo_name=$(basename "$(git rev-parse --show-toplevel)")
current_time=$(date '+%d/%m/%Y %H:%M:%S')
commitmsg="[$repo_name] $current_time"

echo
echo "========================================"
echo "Kho lưu trữ : $repo_name"
echo "Thời gian   : $current_time"
echo "========================================"

git add .

git commit -m "$commitmsg"

git push

echo
echo "========================================"
echo "ĐỒNG BỘ DỮ LIỆU HOÀN TẤT"
echo "Kho lưu trữ : $repo_name"
echo "Commit      : $commitmsg"
echo "Thời gian   : $(date '+%d/%m/%Y %H:%M:%S')"
echo "========================================"

read -rp "Nhấn Enter để thoát"
