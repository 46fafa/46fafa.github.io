---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
slug: {{ substr (md5 (printf "%s%s" .Date (replace .TranslationBaseName "-" " " | title))) 4 8 }}
type: post
tags:
  - 
categories:
  - 
---

