---
title: "{{ replace .Name "-" " " | title }}"
slug: {{ substr (md5 (printf "%s%s" .Date (replace .TranslationBaseName "-" " " | title))) 4 8 }}
date: {{ .Date }}
draft: true
categories: []
tags: []
description: ""
image: ""
series: [""]
---
