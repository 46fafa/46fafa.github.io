@echo off
chcp 65001
REM 定义目标文件夹变量
set "TARGET_FOLDER=D:\blog\public"

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

REM 切换到目标文件夹
cd /d "%TARGET_FOLDER%"

REM 检查目录切换是否成功
if %ERRORLEVEL% neq 0 (
    echo 目录切换失败，错误码：%ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
) else (
    echo 目录切换成功
)

REM 运行 Git 命令
echo 正在运行 Git 命令...
git add .
if %ERRORLEVEL% neq 0 (
    echo git add 命令执行失败，错误码：%ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
) else (
    echo git add 命令执行成功
)

git commit -a -m "auto deploy"
if %ERRORLEVEL% neq 0 (
    echo git commit 命令执行失败，错误码：%ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
) else (
    echo git commit 命令执行成功
)

git push
if %ERRORLEVEL% neq 0 (
    echo git push 命令执行失败，错误码：%ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
) else (
    echo git push 命令执行成功
)

REM 等待5秒后关闭弹窗
echo 操作完成，5秒后关闭窗口...
timeout /t 5 /nobreak >nul
exit