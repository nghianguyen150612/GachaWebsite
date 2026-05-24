# auto-sync.bat

```bat
@echo off
title Git Auto Sync

REM ===== Move to current script folder =====
cd /d "%~dp0"

REM ===== Check git repo =====
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Folder nay khong phai git repository.
    pause
    exit /b
)

REM ===== Get current date/time =====
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
    set mydate=%%a-%%b-%%c
)

for /f "tokens=1-2 delims=:" %%a in ('time /t') do (
    set mytime=%%a-%%b
)

set commitmsg=Auto Sync %mydate% %mytime%

REM ===== Git Sync =====
echo.
echo ===== GIT ADD =====
git add .


echo.
echo ===== GIT COMMIT =====
git commit -m "%commitmsg%"


echo.
echo ===== GIT PUSH =====
git push


echo.
echo ===== DONE =====
echo Commit Message: %commitmsg%

pause
```

## Cách dùng

1. Tạo file:

```txt
auto-sync.bat
```

2. Paste code vào.

3. Đặt file này ở root project:

```txt
D:\Code\my-project
```

4. Double click là nó sẽ:

* git add .
* git commit tự động
* git push lên GitHub

## Lần đầu cần login GitHub

Nên dùng:

* GitHub Desktop
* hoặc Git Credential Manager

để khỏi nhập password mỗi lần.

## Nếu muốn Codex tự sync

Sau khi Codex sửa xong chỉ cần chạy:

```txt
auto-sync.bat
```
