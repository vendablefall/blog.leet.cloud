---
layout: post
title:  "Creating a VPC in AWS part 1"
date:   2017-05-16 14:34:25
categories: AWS
tags: featured
image: /assets/article_images/VPC/cloud-cartoon.jpg
---
# Creating a VPC in AWS with public and private subnets.
<br>
Today I passed the solution architect associate certification (AWS-ASA), this 
morning (before the test) I wanted to cement in my mind how to build a VPC in AWS before the exam. I went through and recorded the steps it took for me to do so, this is by no means 
the best way to do it, simply the way I did it. In part 2 we will add ec2 instances and test the configuration, but today is solely about building out a VPC.

These are the tools I used:
* AWS account (i did this in the Mumbai region)
* Windows 10  OS (desktop)
* putty
* puttygen

Start by logging in to your AWS account and navigating to the VPC service, 
(down the bottom) under Networking & Content Delivery.

[![]({{ site.url }}/assets/article_images/VPC/1-VPC-menu.PNG)]({{ site.url }}/assets/article_images/VPC/1-VPC-menu.PNG)

Once in the VPC console, click the "Your VPC's" link the left nav bar.

[![]({{ site.url }}/assets/article_images/VPC/2-create-new-vpc.PNG)]({{ site.url }}/assets/article_images/VPC/2-create-new-vpc.PNG)

Click the blue "Create VPC button".

[![]({{ site.url }}/assets/article_images/VPC/3-create-vpc-2.PNG)]({{ site.url }}/assets/article_images/VPC/3-create-vpc-2.PNG)

The enter the following details and hit save.

[![]({{ site.url }}/assets/article_images/VPC/4-VPC-details.PNG)]({{ site.url }}/assets/article_images/VPC/4-VPC-details.PNG)

You should then be able to see your new VPC in the console and it should look like the photo below.

[![]({{ site.url }}/assets/article_images/VPC/5-new-VPC.PNG)]({{ site.url }}/assets/article_images/VPC/5-new-VPC.PNG)

Navigate to the subnet menu in the left nav bar and click the blue button "Create Subnet".

[![]({{ site.url }}/assets/article_images/VPC/6-Subnet-menu.PNG)]({{ site.url }}/assets/article_images/VPC/6-Subnet-menu.PNG)

The enter the following details and hit save.

[![]({{ site.url }}/assets/article_images/VPC/7-Public-SN-details.PNG)]({{ site.url }}/assets/article_images/VPC/7-Public-SN-details.PNG)

Repeat the above with these new settings for your private subnet. 

[![]({{ site.url }}/assets/article_images/VPC/8-Private-SN-details.PNG)]({{ site.url }}/assets/article_images/VPC/8-Private-SN-details.PNG)

For HA deployments these steps should be repeated with ip's 10.10.3.0/24, 10.10.4.0/24 each being within a different Availability Zone. (don't forget the naming convention for AZ's as well).

[![]({{ site.url }}/assets/article_images/VPC/9-auto-assign-menu.png)]({{ site.url }}/assets/article_images/VPC/9-auto-assign-menu.png)

Make sure your "MyPublicSN" subnet is selected, then click Subnet Actions and finally Modify auto-assign IP settings. Click the box to Enable 
auto-assign and click Save.

[![]({{ site.url }}/assets/article_images/VPC/10-assign-enable.PNG)]({{ site.url }}/assets/article_images/VPC/10-assign-enable.PNG)

Once you've done that head on over to the "Internet Gateways" link in the 
left nav bar.

[![]({{ site.url }}/assets/article_images/VPC/11-IGW-menu.PNG)]({{ site.url }}/assets/article_images/VPC/11-IGW-menu.PNG)

Click the blue "Create Internet Gateway" button. and enter the following details.

[![]({{ site.url }}/assets/article_images/VPC/12-IGW-settings.PNG)]({{ site.url }}/assets/article_images/VPC/12-IGW-settings.PNG)

You should see your new Internet Gateway (IGW), make sure MyExampleIGW is selected and click "Attach to VPC".

[![]({{ site.url }}/assets/article_images/VPC/12-IGW-detached.PNG)]({{ site.url }}/assets/article_images/VPC/12-IGW-detached.PNG)

Make sure to select "MyExampleVPC" and click Yes, Attach.

[![]({{ site.url }}/assets/article_images/VPC/13-attach-settings.PNG)]({{ site.url }}/assets/article_images/VPC/13-attach-settings.PNG)

Click on Route Tables in the left nav bar and click the blue "Create Route 
Table" button.

[![]({{ site.url }}/assets/article_images/VPC/14-route-table-menu.PNG)]({{ site.url }}/assets/article_images/VPC/14-route-table-menu.PNG)

The enter the following details and hit save.

[![]({{ site.url }}/assets/article_images/VPC/15-public-route-table-settings.PNG)]({{ site.url }}/assets/article_images/VPC/15-public-route-table-settings.PNG)

Make sure MyPublicRouteTable is selected and navigate to the Routes tab at 
the bottom of the centre window and click the blue "Edit" button.

[![]({{ site.url }}/assets/article_images/VPC/16-route-table-edit-routes.PNG)]({{ site.url }}/assets/article_images/VPC/16-route-table-edit-routes.PNG)

The enter the following details and hit save.

[![]({{ site.url }}/assets/article_images/VPC/17-add-IGW-route.png)]({{ site.url }}/assets/article_images/VPC/17-add-IGW-route.png)

Your routes should look like the below image.

[![]({{ site.url }}/assets/article_images/VPC/18-added-IGW-route.PNG)]({{ site.url }}/assets/article_images/VPC/18-added-IGW-route.PNG)

Navigate to the Subnet Associations tab (i actually forgot this part 
initially and couldn't understand what I got wrong) 
Click "Edit". Associate the Route table with the "MyPublicSN-1a.." subnet by checking the box next to its name and click save.

[![]({{ site.url }}/assets/article_images/VPC/15-public-route-table-settings-2.PNG)]({{ site.url }}/assets/article_images/VPC/15-public-route-table-settings-2.PNG)

You should now see the "MyPublicSN-1a.." in the list of associated subnets, as below.

[![]({{ site.url }}/assets/article_images/VPC/15-public-route-table-settings-3.PNG)]({{ site.url }}/assets/article_images/VPC/15-public-route-table-settings-3.PNG)

Use the left nav bar to navigate to the security groups section.

[![]({{ site.url }}/assets/article_images/VPC/19-Sec-group-menu.PNG)]({{ site.url }}/assets/article_images/VPC/19-Sec-group-menu.PNG)

Then click "Create new Security Group" and enter the following details and click save.

[![]({{ site.url }}/assets/article_images/VPC/20-pubic-secgroup-settings.PNG)]({{ site.url }}/assets/article_images/VPC/20-pubic-secgroup-settings.PNG)

Click "Create new Security Group" again and enter the following details and click save.

[![]({{ site.url }}/assets/article_images/VPC/21-private-secgroup-settings.PNG)]({{ site.url }}/assets/article_images/VPC/21-private-secgroup-settings.PNG)

You should now have two security groups as below. Make sure "MyPublic-SecurityGroup" is selected, navigate to the Inbound Rules tab (bottom of the screen) and click the blue edit button.

[![]({{ site.url }}/assets/article_images/VPC/22-edit-pub-secgroup.PNG)]({{ site.url }}/assets/article_images/VPC/22-edit-pub-secgroup.PNG)

Enter the rules as shown below and click save.

[![]({{ site.url }}/assets/article_images/VPC/23-pub-decgroup-settings.PNG)]({{ site.url }}/assets/article_images/VPC/23-pub-decgroup-settings.PNG)

Now make sure the "MyPrivate-SecurityGroup" is selected, under Inbound Rules, click edit and enter the following rules, be sure to select the "MyPublic-SecurityGroup" as the source (as shown below) and finally click save.

[![]({{ site.url }}/assets/article_images/VPC/24-private-secgroup-settings.png)]({{ site.url }}/assets/article_images/VPC/24-private-secgroup-settings.png)

That's it! you now have a VPC in AWS, with public and private subnets and rules for them to communicate! Stay tuned for [Part 2]({{ site.url }}/aws/2017/06/17/Creating-a-VPC-part-2.html "Part2") where we deploy EC2 instances into both subnets and a NAT instance to allow the private subnet to reach the internet!


Thanks for reading!