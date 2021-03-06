---
layout: post
title:  "Vagrant to deploy Ruby on Rails pt1"
date:   2018-06-26 14:34:25
categories: "Dev-Ops"
tags:
image: /assets/article_images/vagrant-ruby/rails_welcome.png
bg-color: white
---

Hello, today on pebkac we will be using vagrant to automate the deployment and configuration of a ruby on rails web server, then in part two of this post we will expand the ruby on rails web server to a single node n-tier stack (3 tiers), in our case NodeJS for the app and SQLite3 for the DB.

[Vagrant](https://www.vagrantup.com/) is an application that makes it super easy to automate the provisioning of VM's; you can push the VM's to AWS, Azure, Vmware or [VirtualBox](https://www.virtualbox.org/) by utilising different providers. Which has makes it a precious tool to any developer or dev-ops engineer, as once you have your stack working locally (utilising VirtualBox) you can change the provider to a public cloud endpoint and deploy your app into the cloud!

This stack was a technical test for a job interview that I completed a while ago; you can find my GitHub repo [here](https://github.com/vendablefall/test )

I consider myself 80% ops 20% dev, so developing the DB and APP parts was the biggest challenge in this whole process for me. Luckily my brother is a ruby web dev after talking to him about the upcoming trial he sold me on the ruby on rails full-stack framework. To summarise, this was my first time using vagrant, first time using Ruby and first time developing a three-tier app. An exciting challenge to say the least.

Versions:
    OS - LinuxMint 18 
    Kernel - 4.12.8
    Vagrant - 1.9.8
    Virtualbox - 5.1.26
    Nano - 2.5.3

Let's get started; Firstly we need [Vagrant](https://www.vagrantup.com/downloads.html) and [VirtualBox](https://www.virtualbox.org/wiki/Downloads) installed. Then we need to create a vagrant dir, a dir for our project (pebkac-demo in this instance) I have chosen /usr/vagrant/ to be my location but you can choose where-ever you please.
     
     sudo mkdir -p /usr/vagrant/pebkac-demo/
     cd /usr/vagrant/pebkac-demo/

We then run "vagrant init" from inside the project dir, this will create a VagrantFile in the directory. The VagrantFile is the brains of the operation, it is where you specify all the VM details, what provider to use, what networking to use and what scripts to run.

     vagrant init

Next, we need to set up the provider and box, a VM "box" is a base image or template that is customised to work with Vagrant, and the provider is the endpoint you want to deploy to. In this example, we will be using the HashiCorp-precise64 box with VirtualBox as the provider. To do this, we need to edit the VagrantFile:
     
     nano VagrantFile

and replace the line:

    'config.vm.box = "base"'' 

with 

    'config.vm.box = "hashicorp/precise64"'


Next, we need to tell Vagrant how many bootstrap scripts to initialise when the image when it boots. To do this, add the following lines below the 'config.vm.box = "hashicorp/precise64"' entry we just put in. We need to add the following lines to the Vagrantfile: 

    nano VagrantFile

Then add the following lines:

    config.vm.provision :shell, path: "bootstrap.sh"
    config.vm.provision :shell, path: "rvm-install.sh"
    config.vm.provision :shell, path: "rvm-setup.sh"
    config.vm.provision :shell, path: "project-setup.sh", privileged: false 

Now we need to create the bootstrap files we just referenced in the VagrantFile.

    touch rvm-install.sh
    touch bootstrap.sh
    touch rvm-setup.sh
    touch project-setup.sh

We then start to place our bootstrap commands into said files; the below commands will update the repositories on the image, install the curl tool (used in the rvm-install.sh), create a /projects/ directory and finally set the correct permissions on the /projects/ directory.

    echo "apt-get update" >> ./bootstrap.sh 
    echo "apt-get install -y curl" >> ./bootstrap.sh
    echo "mkdir /projects/" >> ./bootstrap.sh
    echo "chown vagrant /projects/" >> ./bootstrap.sh

The following commands import a gpg key, pull down the rvm package and then add the path to our system PATH variable.

    echo "gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB" >> ./rvm-install.sh
    echo "\curl -sSL https://get.rvm.io | bash -s stable" >> ./rvm-install.sh
    echo "PATH=$PATH:/usr/local/rvm/scripts/rvm" >> ./rvm-install.sh
    
 Next, we need to add the following commands to the rvm-setup.sh script. These commands will load rvm (I had a few occasions where rvm was not loaded through the path variable setup in the last step, so I added this just in case), then we use rvm to install Ruby 2.2.5, use ruby 2.2.5, change to the /projects/ directory, install ruby on rails and finally install bundler.

    echo "source /usr/local/rvm/scripts/rvm" >> ./rvm-setup.sh
    echo "rvm install 2.2.5" >> ./rvm-setup.sh
    echo "rvm use 2.2.5" >> ./rvm-setup.sh
    echo "cd /projects/" >> ./rvm-setup.sh
    echo "gem install rails" >> ./rvm-setup.sh
    echo "gem install bundler" >> ./rvm-setup.sh

Finally, we can add the commands that will set up our ruby on rails server. The following commands change to the /project/ dir, create a new ruby server called "testapp", switch to the testapp directory, use bundler to install all the gem dependencies; finally, we start the ruby server.

    echo "cd /projects/" >> ./project-setup.sh
    echo "rails new testapp -B" >> ./project-setup.sh
    echo "cd testapp" >> ./project-setup.sh
    echo "bundle install --path /projects/" >> ./project-setup.sh
    echo "bin/rails server" >> ./project-setup.sh

Last but not least, in this optional step, we forward the port ruby is broadcast on (3000 natively) to port 1337 (as this is leet.cloud after all). 

    nano VagrantFile

Add the following line to the VagrantFile:

    config.vm.network "forwarded_port", guest: 3000, host: 1337

Now to test this is all working, we simply type the following command from out /vagrant/ directory:

    cd /usr/vagrant/pebkac-demo/
    vagrant up

After waiting for the image to build, you should be able to open a web browser and navigate to localhost:1337 (or 3000 if you chose not to include the optional step) and hopefully you see the following:

[![]({{ site.url }}/assets/article_images/vagrant-ruby/rails_welcome.png)]({{ site.url }}/assets/article_images/vagrant-ruby/rails_welcome.png)
