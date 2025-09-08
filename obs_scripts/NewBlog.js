const path = require('path');
const { spawn } = require('child_process');

async function executeCommand(quickAddApi, app) {
    // 1. 输入文件名
    const inputFileName = await quickAddApi.inputPrompt(
        "请输入新文章名:",
        "my-new-post"
    );

    if (!inputFileName || inputFileName.trim() === '') {
        new Notice("文章名不能为空，已取消创建。");
        return;
    }

    const fileName = inputFileName.trim() + ".md";

    // 2. Hugo 项目文件夹名
    const hugoProjectFolderName = "blog"; // 按实际修改

    // 3. Hugo 项目完整路径
    const hugoProjectPath = path.join(app.fileManager.vault.adapter.basePath, hugoProjectFolderName);

    // 4. Hugo 可执行文件绝对路径
    const hugoCommand = '/usr/local/bin/hugo';

    // 5. spawn 调用 Hugo
    const hugoProcess = spawn(hugoCommand, ['new', `post/${fileName}`], {
        cwd: hugoProjectPath,
        shell: false, // 绝对不能用 shell
        env: { ...process.env, PATH: '/usr/local/bin:' + process.env.PATH } // 保证 Hugo 在 PATH
    });

    let output = '';
    hugoProcess.stdout.on('data', data => { output += data.toString(); });
    hugoProcess.stderr.on('data', data => { output += data.toString(); });

    hugoProcess.on('close', code => {
        if (code === 0) {
            new Notice(`新博客已创建: ${fileName}`);
        } else {
            new Notice(`Hugo 创建失败 (退出码 ${code})`);
            console.error(output);
        }
    });

    hugoProcess.on('error', err => {
        new Notice(`执行命令时发生错误: ${err.message}`);
        console.error(err);
    });
}

// QuickAdd 入口
module.exports = async (params) => {
    const { quickAddApi, app } = params;
    await executeCommand(quickAddApi, app);
};

