@echo off
chcp 65001
REM 运行 Hugo 命令
echo 正在运行 Hugo 命令...
hugo
if %ERRORLEVEL% neq 0 (
    echo Hugo 命令执行失败，错误码：%ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
) else (
    echo Hugo 命令执行成功
)

REM 运行 Git 命令
echo 正在运行 Git 命令...

REM 添加所有更改到暂存区
git add .
if %ERRORLEVEL% neq 0 (
    echo git add 命令执行失败，错误码：%ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
) else (
    echo git add 命令执行成功
)

REM 提交更改
git commit -m "auto deploy"
if %ERRORLEVEL% neq 0 (
    echo git commit 命令执行失败，错误码：%ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
) else (
    echo git commit 命令执行成功
)

REM 推送到远程仓库
git push
if %ERRORLEVEL% neq 0 (
    echo git push 命令执行失败，错误码：%ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
) else (
    echo git push 命令执行成功
)

REM 等待用户操作
pause

REM 结束脚本
exit