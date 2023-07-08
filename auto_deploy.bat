@echo off

REM 运行 Hugo 命令
hugo

REM 运行 Git 命令
git add .
git commit -a -m "自动提交"
git push