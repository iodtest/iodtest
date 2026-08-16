---
permalink: /
title: ""
excerpt: "M.S. Student @ HIT | 3D Vision & VLM Research"
author_profile: true
classes: wide
redirect_from: 
  - /about/
  - /about.html
---

<div id="about"></div>

About me
======

Welcome! I am Jiaxin Zhang(张佳鑫, Jason), a master student in Computer Science at [Harbin Institute of Technology (HIT)](https://www.hit.edu.cn/), supervised by [Prof. Junjun Jiang](https://homepage.hit.edu.cn/jiangjunjun). Currently, I am an intern at the Multimodal Large Model Lab of Huawei 2012 Laboratories, where I am mentored by [Dave Zhenyu Chen](https://daveredrum.github.io/). Prior to this, I earned my Bachelor’s degree in Computer Science from [HIT](https://www.hit.edu.cn/).

My research focuses on **3D vision**, **geometry-aware multimodal spatial understanding**, and **world-consistent video generation**, with the long-term goal of building spatially intelligent systems for embodied AI. Beyond research, I am a backpacker—either my body or my mind is always on the road.

<div id="news"></div>

🪐 News
======

* **2026.06** Two papers were accepted by **ECCV 2026**.
* **2025.09** One paper was accepted by **NeurIPS 2025**.
* **2025.03** One paper was accepted by **CVPR 2025**.

<div id="internships"></div>

Internships
======

* 2025.05 - 2026.04: Research Intern
  * Huawei 2012 Laboratories, Huawei
  * Department: Multimodal Large Model Lab
  * Supervisor: [Dave Zhenyu Chen](https://daveredrum.github.io/)
  
<div id="awards"></div>

Selected Award
======

* China **National** Scholarship, 2025
* **Special-Class** Scholarship for Postgraduate Students, 2024, 2025(**Top 0.3%**)
* **Outstanding Graduate** of Heilongjiang Province, China, 2024
* The **First-class** Scholarship at Harbin Institute of Technology, 2022, 2023
* **Tencent** Scholarship, 2023
  
<div id="publications"></div>

Publications
======


<style>
.pub-item {
  display: flex;
  align-items: center;  /* ⭐ 改成居中对齐 */
  gap: 20px;
  margin-bottom: 2em;
}

.pub-thumb {
  flex: 0 0 auto;
  width: min(30%, 220px);
  border-radius: 6px;
  --hover-scale: 2.5;
  /* ❌ 去掉 overflow:hidden */
}

.pub-thumb img {
  width: 100%;
  display: block;
  border-radius: 6px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
}

/* ⭐ 悬浮效果升级 */
.pub-thumb img:hover {
  transform: scale(var(--hover-scale));
  z-index: 10;
  box-shadow: 0 8px 25px rgba(0,0,0,0.25);
}

.pub-text {
  flex: 1;
}

.pub-links a {
  margin-right: 10px;
}

/* 📱 移动端 */
@media screen and (max-width: 768px) {
  .pub-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .pub-thumb {
    width: 100%;
    max-width: 280px;
  }
}
</style>

{% assign pubs = site.publications | sort: "date" | reverse %}

{% for post in pubs %}
<div class="pub-item">

  <div class="pub-thumb"{% if post.hover_scale %} style="--hover-scale: {{ post.hover_scale }};"{% endif %}>
    {% if post.header.teaser %}
    <img src="/images/{{ post.header.teaser }}" alt="{{ post.title }}">
    {% endif %}
  </div>

  <div class="pub-text">
    <strong style="font-size:1.05em;">{{ post.title }}</strong><br>

    {% if post.authors %}
    {{ post.authors | replace: "Jiaxin Zhang", "<strong>Jiaxin Zhang</strong>" }}<br>
    {% endif %}

    {% if post.venue %}
      {% if post.venue contains "arXiv" %}
        <em style="color: #3498db;">{{ post.venue }}</em><br>
      {% else %}
        <em style="color: #e74c3c;">{{ post.venue }}</em><br>
      {% endif %}
    {% endif %}

    {% if post.excerpt %}
    <div style="margin-top: 0.4em; margin-bottom: 0.4em;">
      {{ post.excerpt }}
    </div>
    {% endif %}

    <div class="pub-links">
      {% if post.paperurl %}
      <a href="{{ post.paperurl }}">[Paper]</a>
      {% endif %}

      {% if post.codeurl %}
      <a href="{{ post.codeurl }}">[Code]</a>
      {% endif %}

      {% if post.projecturl %}
      <a href="{{ post.projecturl }}">[Project]</a>
      {% endif %}

      {% if post.slidesurl %}
      <a href="{{ post.slidesurl }}">[Slides]</a>
      {% endif %}
    </div>

  </div>

</div>
{% endfor %}

<!-- <script type="text/javascript" id="mapmyvisitors" src="//mapmyvisitors.com/map.js?d=pZeIBZXwpSk2w7PDBVXclXrcFCviVr0XEpjn6fV_oZQ&cl=ffffff&w=300"></script> -->