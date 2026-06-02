---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* Ph.D in Mathematics, McGill University, 2025
* M.Sc. in Mathematics, McGill University, 2021
* B.Sc. (Hon) in Mathematical Physics, University of Alberta, 2019

Work experience
======
* 2025-Present: Postdoctoral Fellow
  * University of Saskatchewan
  * Department of Computer Science


<!-- Research Interests
======
* Numerical Analysis
* Machine learning in scientific computing
* Atmospheric modeling
* Operator learning -->

Publications
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
  
Teaching
======
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Service and leadership
======
