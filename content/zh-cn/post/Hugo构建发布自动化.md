---
title: "简单实现文章自动化部署"
date: 2023-07-23T16:51:28+08:00
slug: ""
type: post
tags:
  - 教程
categories:
  - tech
---

### 效果展示

![](/img/1.gif)

  ### 「Quicker」

事情的起因是我发现使用hugo构建的博客要发布文章需要经过以下几个步骤

```
hugo new post/test.md
打开test.md编辑文章
hugo    生成静态网站文件
git add . 将更改添加到暂存区
git commit -m 将暂存区添加到版本库
git push 将本地的提交推送到远程仓库
```

这实在太麻烦了，我想有没有工具能简化这个步骤，省略输入代码的过程，然后想到「Quicker」

> 「Quicker」 是一个通用的快捷操作工具，用于提高计算机用户的工作效率。它提供了一种简单的方式来创建自定义的快捷操作，以便快速执行常见的任务或操作。

之前有使用「Quicker」实现浏览器外划词翻译，详情看[这篇文章](https://saladict.crimx.com/native.html)，本来想自己设计一个流程，在「Quicker」的动作库中搜索后发现已经有人分享了[类似的操作](https://getquicker.net/Sharedaction?code=6d5ed8b0-1549-4ae4-7bba-08db42e60514)，遂白嫖

![image-20230723174027239](https://img-1316473855.cos.ap-chengdu.myqcloud.com/Quicker1.webp)

这是下载的动作，但是本地实验后发现这个动作没有`hugo`和`git add .`命令，于是针对自己情况对原动作作了修改

![Snipaste_2023-07-23_17-54-51](https://img-1316473855.cos.ap-chengdu.myqcloud.com/quicker2.webp)

这是修改后的动作，要运用到自己博客，只需要将框选路径换成自己文章的位置，⚠️第二个框的路径在文章根目录的上级目录

比如我的文章根目录为`MyBlog\content\zh-cn\post`,上级目录就是`MyBlog\content\zh-cn`

![image-20230723180531905](https://img-1316473855.cos.ap-chengdu.myqcloud.com/quicker3.webp)

使用时目录设置为博客文件的根目录

原作者不允许再次进行分享，为了方便下载，我设置了私人分享[hugo自动化](https://getquicker.net/Sharedaction?code=380d9cbc-3b01-4a38-b3fc-08db8a70701b),需要自取
