const util = require('util');
const child_process = require('child_process');
const exec = util.promisify(child_process.exec);

// executeCommand 函数现在将接收 quickAddApi 作为参数
async function executeCommand(quickAddApi) {
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

    try {
        // 4. 执行 Hugo 命令
        // 注意：app 对象也是通过 QuickAdd 传入的，确保你的 QuickAdd 脚本配置正确
        const { stdout, stderr } = await exec('hugo new post/' + fileName, { cwd: app.fileManager.vault.adapter.basePath });

        // 5. 处理结果并显示通知
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        if (stdout) {
            new Notice("新博客已创建: [" + fileName + "]");
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
    // 注意：app 是全局的，如果你的 Obsidian 环境已经有 app 对象，可以不需要从 params 解构
    // 但为了确保兼容性，从 params 解构是更安全的做法。
    // 在 QuickAdd 脚本中，你通常可以直接访问 app。

    await executeCommand(quickAddApi); // 将 quickAddApi 传递给 executeCommand 函数
}
