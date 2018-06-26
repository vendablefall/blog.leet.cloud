---
layout: post
title:  "Vagrant to deploy ruby on rails pt2"
date:   2018-06-26 14:34:25
categories: "Dev-Ops"
tags:
image: /assets/article_images/vagrant-ruby/rails_welcome.png
---

Hello, today on pebkac we will be continuing on from [](this) post by adding our apop and db tiers to our basic ruby on rails web server. If you havent already I suggest you go back to the post so that we are starting from the same place.

Last time we setup the VagrantFile and some bootstrap scripts that gave us a functioning but very basic ruby on rails webserver. You may also remember that this was all part of a test for a job interview I had to complete for a dev-ops role. The test also stated that I had to use multiple layers (DB, APP and front end) and finally it had to serve a web page that can make a call to the DB and then return a value of some sort. In this installment we will add the various layers to the webserver to make it a true n-tier webserver.

Versions:
	OS - LinuxMint 18 
	Kernel - 4.12.8
	Vagrant - 1.9.8
	Virtualbox - 5.1.26
	Nano - 2.5.3

Lets get started, Firstly we need to change to the directory that hosts our VagrantFile:
     
     cd /usr/vagrant/pebkac-demo/
