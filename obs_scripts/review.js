const util = require('util');
const child_process = require('child_process');
const path = require('path');

// 存储Hugo服务器进程信息
let hugoServerInfo = null;

async function startHugoPreview(quickAddApi, app) {
    // 1. 配置Hugo项目文件夹名称
    const hugoProjectFolderName = "ablog"; // 替换为你的Hugo项目文件夹名称
    
    try {
        // 2. 构建Hugo项目的完整路径
        const hugoProjectPath = path.join(app.fileManager.vault.adapter.basePath, hugoProjectFolderName);
        
        // 3. 检查是否已经有正在运行的Hugo服务器
        if (hugoServerInfo) {
            const restart = await quickAddApi.confirmPrompt(
                "Hugo预览服务器已在运行，是否需要重启？"
            );
            
            if (!restart) {
                new Notice("Hugo预览服务器继续运行中");
                return;
            }
            
            // 终止当前运行的服务器
            try {
                hugoServerInfo.process.kill();
                new Notice("正在重启Hugo预览服务器...");
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error("停止现有服务器失败:", error);
            }
        }
        
        // 4. 启动Hugo服务器（在Windows Terminal中）
        new Notice("正在Windows Terminal中启动Hugo预览服务器...");
        
        // 构建要执行的命令：切换到项目目录并启动Hugo
        const command = `cd "${hugoProjectPath}" && hugo server --disableFastRender`;
        
        // 启动Windows Terminal并执行命令
        const wtProcess = child_process.spawn('wt.exe', ['new-tab', '/k', command], {
            detached: true,  // 让终端独立运行
            stdio: 'ignore'  // 忽略父进程的输入输出
        });
        
        // 存储进程信息
        hugoServerInfo = {
            process: wtProcess,
            pid: wtProcess.pid
        };
        
        // 5. 监听进程事件
        wtProcess.on('error', (error) => {
            new Notice(`启动失败: 请检查Windows Terminal是否安装，错误信息: ${error.message}`);
            console.error('启动错误:', error);
            hugoServerInfo = null;
        });
        
        wtProcess.on('exit', (code) => {
            if (code === 0) {
                new Notice('Hugo预览服务器已正常关闭');
            } else if (code) {
                new Notice(`Hugo预览服务器已退出，退出码: ${code}`);
            }
            hugoServerInfo = null;
        });
        
        // 6. 提示用户服务器已启动
        new Notice('Hugo预览服务器已在Windows Terminal中启动，通常在 http://localhost:1313 可访问');
        
    } catch (error) {
        new Notice(`执行命令时发生错误: ${error.message}`);
        console.error('命令执行错误:', error);
    }
}

// 停止Hugo服务器的函数
async function stopHugoPreview(quickAddApi) {
    if (hugoServerInfo && hugoServerInfo.process) {
        try {
            hugoServerInfo.process.kill();
            new Notice('正在停止Hugo预览服务器...');
        } catch (error) {
            new Notice('停止服务器失败，请在Windows Terminal中手动按Ctrl+C关闭');
            console.error('停止错误:', error);
        }
        hugoServerInfo = null;
    } else {
        new Notice('没有正在运行的Hugo预览服务器');
    }
}

// 主函数，根据用户选择执行启动或停止
module.exports = async (params) => {
    const { quickAddApi, app } = params;
    
    // 让用户选择启动或停止服务器
    const action = await quickAddApi.suggester(
        ["启动Hugo预览", "停止Hugo预览"],
        ["start", "stop"]
    );
    
    if (action === "start") {
        await startHugoPreview(quickAddApi, app);
    } else if (action === "stop") {
        await stopHugoPreview(quickAddApi);
    }
};
