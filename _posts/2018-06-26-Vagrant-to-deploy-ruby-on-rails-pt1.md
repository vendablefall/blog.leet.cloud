---
layout: post
title:  "Vagrant to deploy ruby on rails pt1"
date:   2018-06-26 14:34:25
categories: "Dev-Ops"
tags:
image: /assets/article_images/vagrant-ruby/rails_welcome.png
---

Hello, today on pebkac we will be using vagrant to automate the deployment and configuration of a ruby on rails webserver, then in part two of this post we will expand the ruby on rails webserver to a single node n-tier stack (3 tiers), in our case NodeJS for the app and SQLite3 for the DB.

Vagrant is an application that makes it super easy to automate provisioning of VM's, you can push the VM's to AWS, Azure, Vmware or VirtualBox by utilizing different providers. This makes it a very valuable tool to any developer or dev-ops eningeer, as once you have your stack working locally (utilizing virtualbox) you can simply change the provider to a public cloud endpoint and deploy your app into the cloud!

This stack was a technical test for a job interview that I completed a few days ago, it had to be tracked on github (you can find my repo here https://github.com/vendablefall/test ) so they can, in their words, "see how I think". 

It also had to use multiple layers (DB, APP and front end) and finally it had to serve a web page from port 80 (ive since changed it to 1337) that can make a call to the DB and then return a value of some sort.

I consider myself 80% ops 20% dev, so developing the DB and APP was the biggest challenge in this whole process for me. Luckily my brother is a ruby web dev after talking to him about my upcomming challenge he sold me on the ruby on rails fullstack framework. To summarise, this was my first time using vagrant, first time using ruby and first time developing a three tier app. Exciting challenge to say the least.

Versions:
	OS - LinuxMint 18 
	Kernel - 4.12.8
	Vagrant - 1.9.8
	Virtualbox - 5.1.26
	Nano - 2.5.3

Lets get started, Firstly we need to create a vagrant dir, a dir for our project (pebkac-demo in this instance) I have chosen /usr/vagrant/ to be my location but you can choose where-ever you please.
     
     sudo mkdir -p /usr/vagrant/pebkac-demo/
     cd /usr/vagrant/pebkac-demo/

We then run "vagrant init" from inside the project dir, this will create a VagrantFile in the directory. The VagrantFile is the brains of the operation, it is where you specify all the vm details, what provider to use, what networking to use and what scripts are run in what order.

     vagrant init

Next we need to setup the provider and box, a vm "box" is a base image or template that is customised to work with Vagrant and the provider is the endpoint you want to deploy to. In this example we will be using the hashicorp-precise64 box with VirtualBox as the provider. To do this we need to edit the VagrantFile and replace the line:
'config.vm.box = "base"'' 
with 
'config.vm.box = "hashicorp/precise64"'
     
     nano VagrantFile

Next we need to setup a bootstrap script to initialise the image when it boots and for Ruby Version Manager (rvm). To do this simply add the following lines below the 'config.vm.box = "hashicorp/precise64"' entry we just put in. We need to add the following line to the Vagrantfile: 
config.vm.provision :shell, path: "bootstrap.sh"
config.vm.provision :shell, path: "rvm-install.sh"
config.vm.provision :shell, path: "rvm-setup.sh"
config.vm.provision :shell, path: "project-setup.sh", privileged: false 

    nano VagrantFile

Now we need to actually create the bootstrap files we just referenced in the VagrantFile.

    touch rvm-install.sh
    touch bootstrap.sh
	touch rvm-setup.sh
	touch project-setup.sh

 Then place our first bootstrap commands into said files, the below command will just update the repositories on the image and then install the curl tool (which will be used in the rvm-install.sh)

    echo "apt-get update" >> ./bootstrap.sh 
	echo "apt-get install -y curl" >> ./bootstrap.sh
	echo "mkdir /projects/" >> ./bootstrap.sh
	echo "chown vagrant /projects/" >> ./bootstrap.sh

The following commands import a gpg key, pull down the rvm package and then add the path to our system PATH variable.

	echo "gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB" >> ./rvm-install.sh
	echo "\curl -sSL https://get.rvm.io | bash -s stable" >> ./rvm-install.sh
    echo "PATH=$PATH:/usr/local/rvm/scripts/rvm" >> ./rvm-install.sh
	
 Next we need to add the following commands to the rvm-setup.sh script.

    echo "source /usr/local/rvm/scripts/rvm" >> ./rvm-setup.sh
	echo "rvm install 2.2.5" >> ./rvm-setup.sh
	echo "rvm use 2.2.5" >> ./rvm-setup.sh
	echo "cd /projects/" >> ./rvm-setup.sh
	echo "gem install rails" >> ./rvm-setup.sh
    echo "gem install bundler" >> ./rvm-setup.sh

Finally we can add the commands that will setup our ruby project.

    echo "cd /projects/" >> ./project-setup.sh
    echo "rails new testapp -B" >> ./project-setup.sh
    echo "cd testapp" >> ./project-setup.sh
    echo "bundle install --path /projects/" >> ./project-setup.sh
    echo "bin/rails server" >> ./project-setup.sh

Last but deffinatley not least iont his optional step we forward the port ruby is being broadcast on (3000 nativly) to port 1337 (as this is leet.cloud after all). Add the following line to the VagrantFile:
config.vm.network "forwarded_port", guest: 3000, host: 1337

    nano VagrantFile

Now to test that this is all working we simply type the following command from out /vagrant/ directory:

    cd /usr/vagrant/pebkac-demo/
    vagrant up

You should be able to now open a web browser and navigate to localhost:1337 (or 3000 if you chose not to include the optional step) and hopefully you see the following:

[![]({{ site.url }}/assets/article_images/vagrant-ruby/rails_welcome.png)]({{ site.url }}/assets/article_images/vagrant-ruby/rails_welcome.png)
