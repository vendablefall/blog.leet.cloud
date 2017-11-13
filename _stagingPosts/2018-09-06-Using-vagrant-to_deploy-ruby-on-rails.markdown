---
layout: post
title:  "Using vagrant to deploy ruby on rails"
date:   2018-09-06 14:34:25
categories: "Dev-Ops"
tags:
image: /assets/article_images/VPC/cloud-cartoon.jpg
---

Hello, today on pebkac we will be using vagrant to automate the deployment and configuration of a single node n-tier stack. Vagrant is ana application that makes it super easy to automate provisioning of VM's, you can push the VM's to AWS, Azure, Vmware or VirtualBox by utilizing different providers. This makes it very valuable to any developer or dev-ops eningeer as once you have your stack working locally (utilizing virtualbox) you can simply change the provider to a public cloud endpoint and deploy your app into the cloud.

This stack was a technical test for a job interview that I completed a few days ago, it had to be tracked on github (you can find my repo here INSERT REPO) so they can, in their words, "see how I think", It also had to use multiple layers (DB, APP and front end) and finally it had to server a web page from port 80 that made a call to the DB and then returne a value of some sort.

I consider myself 80% ops 20% dev, so developing the DB and APP was the biggest challenge in this whole process for me. Luckily my brother is a ruby web dev after talking to him about my upcomming challenge he sold me on the ruby on rails fullstack framework. To summarise, this was my first time using vagrant, first time using ruby and first time developing a three tier app. Exciting challenge to say the least.

Versions:
	OS - LinuxMint 18 
	Kernel - 4.12.8
	Vagrant - 1.9.8
	Virtualbox - 5.1.26
	Nano - 2.5.3

Lets get started, Firstly we need to create a vagrant dir, a dir for our project (pebkac-demo in this instance)I have chosen /usr/vagrant/ to be my location but you can choose where-ever you please.
     
     sudo mkdir -p /usr/vagrant/pebkac-demo/
     cd /usr/vagrant/pebkac-demo/

We then run "vagrant init" from inside the project dir, this will create a VagrantFile in the directory. The VagrantFile is the brains of the operation, it is where you specify all the vm details, what provider to use, what networking to use and what scripts are run in what order.

     vagrant init

Next we need to setup the provider and box, a vm "box" is a base image or template that is customised to work with Vagrant and the provider is the endpoint you want to deploy to. In this example we will be using the hashicorp-precise64 box with VirtualBox as the provider. To do this we need to edit the VagrantFile and replace the line:
'config.vm.box = "base"'' 
with 
'config.vm.box = "hashicorp/precise64" ''
     
     nano VagrantFile
