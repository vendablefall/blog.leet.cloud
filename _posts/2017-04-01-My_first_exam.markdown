---
layout: post
title:  "My first exam VCP6-DCV"
date:   2017-04-01 14:34:25
categories: "Study"
tags: 
image: /assets/article_images/my-first-exam/vmware1.png
---

For my first exam I decided to go with the lowest hanging exam fruit, VMware, due to my two years of experience working with the vendor and their tech stack. However deciding to go with VMware was only half of the battle, as you can see below their are many exams offered by VMware, but which certification is right for you?

![VMware Certifications](  {{ site.url }}/assets/article_images/my-first-exam/cert-roadmap.jpg )

That is a question that is not easily answered, I chose the VCP6-DCV qualification as the VCA6 didnt hold enough sway for my liking (I felt it was a glorified sales cert) and im not a "Network" guy so the NV (Network Virtualisation) stream was not for me. VCP6-DCV seems to be the benchmark cert in VMware's inventory in which others are comapred to, sure there are more advanced certs but this is a great starting point.

Once I had picked the cert it was onto fulfilling the requirements:
1. Sit and pass the Vmware foundations exam.
2. Complete a vSphere 6 course
3. Sit and pass the VCP6-DCV exam

I spent the first three months fo this year (2017) studying my little butt off, each night, some mornings (before work) all my weekends were gone, I was a blur of paperwork and coffee, never in my life have i studied so hard (and that includes university). 

For the VMware foundations course I primarily used the supurb PluralSight learning path by [David David and Josh Cohen](https://www.pluralsight.com/paths/vmware-vsphere-6-foundations), I would watch the lecture videos and write down notes on what I thought was important and then review what I had noted down at the end of the lecture. The couse above coupled with my 2 years of experiance with VMware was enough to fly through the VMware Foundations exam.

Luckily my employer had sent me on a VMware advanced troubleshooting in vSphere 6 course just six months before I decided to take the VCP6-DCV, So i didnt have to spend $5000 AUD on a week long course just for the peasure of sitting the exam (grumble grumble).

Finally it was time to study for the final exam, for this I again primarily used PluralSights VMware vSphere 6 Data Center course by [Don Jones](https://www.pluralsight.com/blog/it-ops/learning-path-vmware-vsphere-6-data-center-virtualization-vcp6-dcv) as it follows onr eally well from the foundations course. Once i made it throught he 20+ hours of lecture videos, I stated setting up my lab (or labs), luckily I work for a I.T service provider, which gives me access to a fairly expansive testing facility. This allowed me to create a virtualised ESXi cluster with imbedded and external vCenter servers. The knowledge I gained from creating this environment (over and over again) was invaluable, nothing sicks in you mind more than the fix you found after trawling the interenet for hours. I would highly reccomend downloading [Vmware Workstation](https://www.vmware.com/au/products/workstation.html) or [Oracle Virtual Box](https://www.virtualbox.org/) and creating your own virtual esxi cluster with vCenter servers to cement your knwoledge in HA clusters, VSAN deployments, virtual netoworking, storage and troubleshooting.

When the day finaly came, I was ready, i had deployed 5+ ESXi + vCenter envrionments from scratch, I knew the steps like the back of my hand. I had spent 40+ hours studying PluralSight lectures and I was eagre to flex my VMware muscle on the exam. 

I passed the exam with 400/500 about 80% which i was quite happy with as the pass mark was 60%, the satisfaction that comes with passing an exam you have put that much effort into studying for in your own time is priceless, one of the best feelings ever. I hope you get to know that feeling soon :-).

Stay tuned to find out which cert I decided to go with second [here]({{ site.url }}/study/2017/04/21/Studying_for_AWS_CSA_exam.html "My Second Exam")