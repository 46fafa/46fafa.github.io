---
title: 利用Gemini实现pot-App插件开发
slug: c6ded1a6
date: 2025-08-12T22:29:12+08:00
draft: false
categories:
  - tech
tags: 
description: 
image:
series:
  - ""
---
测试功能后本想把插件提交到官方插件仓库的，提交的时候才发现早有人实现这个功能了，只是作者还没处理合并请求🤣，在这里记录下这次开发~~调教AI~~

---

## Pot-app
[Pot](https://pot-app.com/)是一个带有OCR功能的跨平台划词翻译软件，并且内置有插件系统，有丰富的官方插件，还可以自己开发插件，基本满足了我对翻译软件的需求。
![image.png](https://r2-img.lesx.top/20250816203934792.webp)
## ~~开发~~
我平时使用[墨墨背单词](https://www.maimemo.com/)(以下简称墨墨)，在墨墨设置看见开放了API，于是想到写一个插件将Pot翻译的生词导入墨墨复习，翻看了Pot插件仓库提供的[生词本插件模板](https://github.com/pot-app/pot-app-collection-plugin-template)，插件结构比较简单

```
├── pot-app-collection-plugin-template
│   ├── info.json
│   └── main.js
```

虽然不懂JavaScript,还好有AI，直接把需求喂给AI，然后调教了几轮，很快就实现了功能，中途参考了[bob-plugin-maimemo-notebook](https://github.com/chriscurrycc/bob-plugin-maimemo-notebook)，最终实现的效果:
![image.png](https://r2-img.lesx.top/20250816221019200.webp)

