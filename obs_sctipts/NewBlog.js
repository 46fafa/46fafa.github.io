const util = require('util');
const child_process = require('child_process');
const exec = util.promisify(child_process.exec);
const path = require('path'); // 新增：引入 path 模块

// executeCommand 函数现在将接收 quickAddApi 和 app 作为参数
async function executeCommand(quickAddApi, app) { // 确保接收 app 参数
    // 1. 提示用户输入文件名，使用 quickAddApi.inputPrompt()
    const inputFileName = await quickAddApi.inputPrompt(
        "请输入新文章的文件名:",
        "my-new-post" // 这是一个可选的placeholder，会在输入框中显示
    );

    // 2. 检查用户是否取消或输入了空值
    if (!inputFileName || inputFileName.trim() === '') {
        new Notice("文件名不能为空，已取消创建。");
        return; // 退出函数
    }

    // 3. 构建完整的文件名（加上.md后缀）
    const fileName = inputFileName.trim() + ".md";

    // **** 核心修改 ****
    // 请将 'ablog' 替换为你的 Hugo 项目的实际文件夹名称
    // 如果你的 Hugo 项目文件夹就是 'ablog'，则无需修改
    const hugoProjectFolderName = "ablog";

    try {
        // 构建 Hugo 项目的完整路径
        const hugoProjectPath = path.join(app.fileManager.vault.adapter.basePath, hugoProjectFolderName);

        // 4. 执行 Hugo 命令
        // 修正 cwd 为 Hugo 项目的根目录
        const { stdout, stderr } = await exec('hugo new post/' + fileName, { cwd: hugoProjectPath });

        // 5. 处理结果并显示通知
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        if (stdout) {
            new Notice("新博客已创建: [" + fileName + "]");
            // 可选：在这里添加打开新文件的逻辑
            // const newFilePath = path.join(hugoProjectPath, 'content', 'post', fileName);
            // app.workspace.openLinkText(newFilePath, '', false); // 打开新文件
        } else {
            new Notice("新博客创建失败: " + stderr);
        }
    } catch (error) {
        // 捕获命令执行时的错误（例如命令不存在，路径错误等）
        new Notice("执行命令时发生错误: " + error.message);
        console.error("执行命令时发生错误:", error);
    }
}

// 模块导出：QuickAdd 会将 quickAddApi, app, variables 等参数传入这里
module.exports = async (params) => {
    const { quickAddApi, app } = params; // 解构 quickAddApi 和 app

    await executeCommand(quickAddApi, app); // 将 quickAddApi 和 app 传递给 executeCommand 函数
}
