---
layout: post
title:  "Creating a VPC in AWS part 2"
date:   2017-06-16 14:34:25
categories: AWS
tags:
image: /assets/article_images/VPC/cloud-cartoon.jpg
---
# Creating a single NAT instance and Bastion Host/Jump Box in our VPC from [Part 1]({{ site.url }}/aws/2017/05/16/Creating-a-VPC-part-1.html "Part 1")
<br>
Today we will be adding EC2 instances to each of the subents we made inside the VPC last time. We will then test the connectivity between the subnets and finally add a NAT instance to the public subnet to get internet access from inside the private subnet, Lets get started.

Firstly, log in your the AWS console using your account, then navigate to the EC2 console, under the "Compute" heading, (you can see it in the top left corner, in the below image")

[![]({{ site.url }}/assets/article_images/VPC2/25-EC2-menu.png)]({{ site.url }}/assets/article_images/VPC2/25-EC2-menu.png)

Click the blue "Launch Instance" button.

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2.PNG)

Select the "Amazon Linux AMI ..." that can be seen at the top of the list in the image below.

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-2.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-2.PNG)

Make sure "t2.micro" (to stay within the free tier) is selected and click "Next: Configure Instance Details" (in the bottom right).

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-3.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-3.PNG)

Make sure you select "MyExampleVPC" and "MyPrivateSN" from the dropdowns as in the image below. Then click "Next: Add Storage" (in the bottom right).

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-4.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-4.PNG)

Leave all the settings as default and click "Next: Add Tags"

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-5.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-5.PNG)

For the Key enter "Name" and Value enter "MyPrivateInstance" then click "Next: Configure Security Group"

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-6.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-6.PNG)

Click "Select and existing security group", then make sure MyPrivate-SecurityGroup is selected and click "Review and Launch".

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-7.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-7.PNG)

Use this chance to check over your configuration and ensure the details are correct. Once you are sure click the blue "Launch" button in the bottom right.

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-8.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-8.PNG)

You will be propted with the popup shown below, from the first dropdown select "Create a new key pair" and name it "MyExampleVPCKEY". Click "Download key pair" and save it in a location that is easy to access (we will need this later)Once that is done click "Launch Instances"

[![]({{ site.url }}/assets/article_images/VPC2/27-my-key-pair.PNG)]({{ site.url }}/assets/article_images/VPC2/27-my-key-pair.PNG)

You should then be presented with a screen closely resembling the below image. Click the blue "View Instances" button int he bottom right. Then click "Launch Instance" again to start configuring the deployment of our second EC2 instance.

[![]({{ site.url }}/assets/article_images/VPC2/28-my-instance-launch.PNG)]({{ site.url }}/assets/article_images/VPC2/28-my-instance-launch.PNG)

You should then see the below screen again, make sure to select "t2.micro" again, click "Next: Configure Instance Details" in the bottom right.

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-2.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-2.PNG)

Make sure you select "MyExampleVPC" and "MyPublicSN" from the dropdown's like in the image below. Then click "Next: Add Storage" (in the bottom right).

[![]({{ site.url }}/assets/article_images/VPC2/29-launch-public-ec2-1.PNG)]({{ site.url }}/assets/article_images/VPC2/29-launch-public-ec2-1.PNG)

Leave all the settings as default and click "Next: Add Tags"

[![]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-5.PNG)]({{ site.url }}/assets/article_images/VPC2/26-launch-priv-ec2-5.PNG)

For the Key enter "Name" and Value enter "MyPublicInstance" then click "Next: Configure Security Group"

[![]({{ site.url }}/assets/article_images/VPC2/29-launch-public-ec2-2.PNG)]({{ site.url }}/assets/article_images/VPC2/29-launch-public-ec2-2.PNG)

Click "Select and existing security group", then make sure MyPublic-SecurityGroup is selected and click "Review and Launch".

[![]({{ site.url }}/assets/article_images/VPC2/29-launch-public-ec2-3.PNG)]({{ site.url }}/assets/article_images/VPC2/29-launch-public-ec2-3.PNG)

This time we will be using the same Key as last time, so make sure you select "Choose and existing key pair" and select "MyExampleVPCKEY" that we made before, Click "Launch Instances".

[![]({{ site.url }}/assets/article_images/VPC2/30-my-key-pair.PNG)]({{ site.url }}/assets/article_images/VPC2/30-my-key-pair.PNG)

You should now see this screen again, click the blue "View Instances" button int he bottom right. 

[![]({{ site.url }}/assets/article_images/VPC2/28-my-instance-launch.PNG)]({{ site.url }}/assets/article_images/VPC2/28-my-instance-launch.PNG)

You should now be back in the below screen and you should be able to see your two insances. Click "Launch Instance" one last time to start configuring our NAT instance.

[![]({{ site.url }}/assets/article_images/VPC2/31-ec2-menu.PNG)]({{ site.url }}/assets/article_images/VPC2/31-ec2-menu.PNG)

This time instead of using the "Quick Start" menu, use the left nav bar to select "Community AMI's" and search for "ami-vpc-nat" as shown below. Once found click the blue "Select" button next to the most recent AMI available (the date can be found in the name).


[![]({{ site.url }}/assets/article_images/VPC2/32-find-nat-ami.PNG)]({{ site.url }}/assets/article_images/VPC2/32-find-nat-ami.PNG)

Make sure "t2.micro" (to stay within the free tier) is selected and click "Next: Configure Instance Details" (in the bottom right).

[![]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-1.PNG)]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-1.PNG)

Make sure you select "MyExampleVPC" and "MyPublicSN" from the dropdown's like in the image below. Then click "Next: Add Storage" (in the bottom right).

[![]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-2.PNG)]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-2.PNG)

Leave all the settings as default and click "Next: Add Tags"

[![]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-3.PNG)]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-3.PNG)

For the Key enter "Name" and Value enter "MyNATInstance" then click "Next: Configure Security Group"

[![]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-4.PNG)]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-4.PNG)

Click "Select and existing security group", then make sure MyPublic-SecurityGroup is selected and click "Review and Launch".

[![]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-5.PNG)]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-5.PNG)

You will get the popup below, just keep the defaults and click "Next"

[![]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-6.PNG)]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-6.PNG)

Review the information below, and once you deem it is correct click "Launch"

[![]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-7.PNG)]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-7.PNG)

We will be using the same Key as last time again, so make sure you select "Choose and existing key pair" and select "MyExampleVPCKEY" that we made before, Click "Launch Instances".

[![]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-8.PNG)]({{ site.url }}/assets/article_images/VPC2/33-NAT-config-8.PNG)

You should now see this screen again, click the blue "View Instances" button int he bottom right. 

[![]({{ site.url }}/assets/article_images/VPC2/28-my-instance-launch.PNG)]({{ site.url }}/assets/article_images/VPC2/28-my-instance-launch.PNG)

You should now see all three instances in the EC@ console, some may take a few minutes to provision.

[![]({{ site.url }}/assets/article_images/VPC2/34-EC2-instances-finished.PNG)]({{ site.url }}/assets/article_images/VPC2/34-EC2-instances-finished.PNG)

Make sure "MyNATInstance" is selected, then click actions, networking and "Change Source/Dest Check".

[![]({{ site.url }}/assets/article_images/VPC2/35-NAT-source-dest-check-1-8.PNG)]({{ site.url }}/assets/article_images/VPC2/35-NAT-source-dest-check-1-8.PNG)

When you are presented with the popup below click the blue "Yes, Disable" button.

[![]({{ site.url }}/assets/article_images/VPC2/35-NAT-source-dest-check-2.PNG)]({{ site.url }}/assets/article_images/VPC2/35-NAT-source-dest-check-2.PNG)

Thats all for today, but join me in [Part 3]({{ site.url }}/aws/2017/07/16/Creating-a-VPC-part-3.html "Part 3") for testing of the configuration.