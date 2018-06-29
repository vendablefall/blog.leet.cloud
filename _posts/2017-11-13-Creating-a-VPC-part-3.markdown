---
layout: post
title:  "Creating a VPC in AWS part 3"
date:   2017-11-13 14:34:25
categories: AWS
tags:
image: /assets/article_images/VPC/cloud-cartoon.jpg
bg-color: white
---
**Testing the VPC we deployed in [Part 2]({{ site.url }}/aws/2017/06/17/Creating-a-VPC-part-2.html "Part 2")**
<br>
<br>
Today in the third and final installation in our series we will be testing the VPC using the instances we deployed last time, to ensure everything is working properly. We will then enable internet traffic to the private subnet via our NAT instance, enough talking, let us get started.

(Sorry for the delay in this post, my other blog www.littlekiwibus.com has been taking a lot of my time recently leading to pebkac being neglected :-( )

I was using Windows10 as my OS for this guide which made puttygen necessary if you are using a Linux distro or MacOS you can skip the first 4 steps. Instead of putty to ssh, you can just use the inbuilt terminal! (I have since swapped my primary OS to Linux Mint so no longer need putty and puttygen). To download Putty go [http://www.putty.org](here) and make sure you include PuttyGen. 


Below we see the Putty Gen GUI, you'll want to "Load" your .pem file supplied by AWS, click Load, and locate your .pem file.

[![]({{ site.url }}/assets/article_images/VPC3/36-puttygen.PNG)]({{ site.url }}/assets/article_images/VPC3/36-puttygen.PNG)

You should then see the following.

[![]({{ site.url }}/assets/article_images/VPC3/36-puttygen-2.PNG)]({{ site.url }}/assets/article_images/VPC3/36-puttygen-2.PNG)

Then click "Save private key", you can add a passphrase to it if you like, for these purposes I did not.

[![]({{ site.url }}/assets/article_images/VPC3/36-puttygen-3.PNG)]({{ site.url }}/assets/article_images/VPC3/36-puttygen-3.PNG)

Save your key as a .ppk format somewhere safe for later use.

[![]({{ site.url }}/assets/article_images/VPC3/36-puttygen-4.PNG)]({{ site.url }}/assets/article_images/VPC3/36-puttygen-4.PNG)

Now we open Putty.exe, the Putty GUI looks like below.

[![]({{ site.url }}/assets/article_images/VPC3/37-putty-1.PNG)]({{ site.url }}/assets/article_images/VPC3/37-putty-1.PNG)

Navigate down the window on the left and under SSH you will find the Auth section, select Auth.

[![]({{ site.url }}/assets/article_images/VPC3/37-putty-2.PNG)]({{ site.url }}/assets/article_images/VPC3/37-putty-2.PNG)

Now jump back to your AWS console and the "Session" window of Putty. Find the Public IP address of your "MyPublicInstance" in AWS (in my case 52.66.8.38), prefix it with "ec2-user@" (in my case ec2-user@52.66.8.38) and type this into the "Host Name" text box back on the main window of Putty, then click "Open".

[![]({{ site.url }}/assets/article_images/VPC3/37-putty-3.PNG)]({{ site.url }}/assets/article_images/VPC3/37-putty-3.PNG)

You should now see the below Security Alert, click "Yes" to accept the certificate.

[![]({{ site.url }}/assets/article_images/VPC3/38-putty-accept.PNG)]({{ site.url }}/assets/article_images/VPC3/38-putty-accept.PNG)

You should now see the SSH session just like below.

[![]({{ site.url }}/assets/article_images/VPC3/39-ssh-login.PNG)]({{ site.url }}/assets/article_images/VPC3/39-ssh-login.PNG)

Run the below commands, to create a key folder for later use.
    cd /home/ec2-user/
    mkdir keys
    ll
Your output should match the screenshot below.

[![]({{ site.url }}/assets/article_images/VPC3/40-ssh-commands.PNG)]({{ site.url }}/assets/article_images/VPC3/40-ssh-commands.PNG)

Here I found the Private IP for "MyPrivateInstance" in the AWS console (10.10.2.143), and confirmed that the two instances have imcp connectivity by running:
    ping 10.10.2.143
From my SSH session. 

[![]({{ site.url }}/assets/article_images/VPC3/40-ssh-ping.PNG)]({{ site.url }}/assets/article_images/VPC3/40-ssh-ping.PNG)

I now confirm internet connectivity by running:
    sudo su
    yum update
(the quick amongst us will realise just by virtue of logging into this instance we confirmed internet connectivity, but it never hurt to be thorough.)

[![]({{ site.url }}/assets/article_images/VPC3/41-sucessful-yum-update-1.PNG)]({{ site.url }}/assets/article_images/VPC3/41-sucessful-yum-update-1.PNG)

Here I will enter "n" as I am not really interested in the update, I just wanted to verify a connection to the internet.

[![]({{ site.url }}/assets/article_images/VPC3/41-sucessful-yum-update-2.PNG)]({{ site.url }}/assets/article_images/VPC3/41-sucessful-yum-update-2.PNG)

We are half way people! Now to test the private instance! Here we locate the .pem file we created earlier.

[![]({{ site.url }}/assets/article_images/VPC3/42-copy-pem-contents.PNG)]({{ site.url }}/assets/article_images/VPC3/42-copy-pem-contents.PNG)

Open it with your text editor of choice and copy the contents, making sure not to copy any excess whitespace.
(normally I would do this with WinSCP, or just scp in Linux, but this was the "quick and dirty way I got it going before my exam)

[![]({{ site.url }}/assets/article_images/VPC3/42-copy-pem-contents-2.PNG)]({{ site.url }}/assets/article_images/VPC3/42-copy-pem-contents-2.PNG)

Type the following commands:
    cd keys/
    touch MyExampleVPCKEY.pem
    nano MyExampleVPCKEY.pem

[![]({{ site.url }}/assets/article_images/VPC3/43-edit-key-file.PNG)]({{ site.url }}/assets/article_images/VPC3/43-edit-key-file.PNG)

Here we have the .pem file open.

[![]({{ site.url }}/assets/article_images/VPC3/43-edit-key-file-2.PNG)]({{ site.url }}/assets/article_images/VPC3/43-edit-key-file-2.PNG)

Paste the contents of the .pem file we copied into the new file via the SSH window. (Make sure to trim any whitespace from the start and end of the file)

[![]({{ site.url }}/assets/article_images/VPC3/43-edit-key-file-3.PNG)]({{ site.url }}/assets/article_images/VPC3/43-edit-key-file-3.PNG)

Save the file in nano using the following commands:
    Ctrl + O
    Y

[![]({{ site.url }}/assets/article_images/VPC3/43-edit-key-file-4.PNG)]({{ site.url }}/assets/article_images/VPC3/43-edit-key-file-4.PNG)

Run the following commands to set the appropriate permissions on the .pem file:
    chmod 0600 MyExampleVPCKEY.pem

[![]({{ site.url }}/assets/article_images/VPC3/44-chmod-0600-pem.PNG)]({{ site.url }}/assets/article_images/VPC3/44-chmod-0600-pem.PNG)

Here we run the following, to open another SSH session (to our private instance) from our public instance SSH session (SSH-ception I know!) you will have to replace the IP address below with one from your "MyPrivateInstance".
    ssh -i MyExampleVPCKEY.pem ec2-user@10.10.2.143

[![]({{ site.url }}/assets/article_images/VPC3/45-ssh-into-private.PNG)]({{ site.url }}/assets/article_images/VPC3/45-ssh-into-private.PNG)

You should then see the below warning, accept the key by typing in "yes".

[![]({{ site.url }}/assets/article_images/VPC3/45-ssh-into-private-2.PNG)]({{ site.url }}/assets/article_images/VPC3/45-ssh-into-private-2.PNG)

Your screen should now look like the below image, Notice how the top two lines state a 10.10.1.241 host (MyPublicInstance) while the bottom line states 10.10.2.143 (MyPrivateInstance), we are now inside our private instance!.

[![]({{ site.url }}/assets/article_images/VPC3/45-ssh-into-private-3.PNG)]({{ site.url }}/assets/article_images/VPC3/45-ssh-into-private-3.PNG)

Run the following commands to test internet connectivity:
    sudo su
    yum update

[![]({{ site.url }}/assets/article_images/VPC3/46-private-commands.PNG)]({{ site.url }}/assets/article_images/VPC3/46-private-commands.PNG)

Here we run into a connectivity error, we have no access to the internet! fear not, this was intentional, we will resolve this soon.

[![]({{ site.url }}/assets/article_images/VPC3/46-private-commands-2.PNG)]({{ site.url }}/assets/article_images/VPC3/46-private-commands-2.PNG)

The reason we couldn't reach out from "MyPrivateInstance" is that we haven't yet set up a route for that traffic to reach out. Go back to the AWS console, inside the VPC dashboard and select the "Route Tables" tab, Click "Create Route Table".

[![]({{ site.url }}/assets/article_images/VPC3/47-route-table-menu.PNG)]({{ site.url }}/assets/article_images/VPC3/47-route-table-menu.PNG)

Enter the detials as seen below:

[![]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings.PNG)]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings.PNG)

Once the Route Table is created, select the "Route" tab, then "Edit", enter 0.0.0.0/0 (CIDR for everything) as the destination and MyNATInstance as the target, finally click Save.

[![]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings-2.PNG)]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings-2.PNG)

You should now see the green "Save Successful" just like my screenshot below.

[![]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings-3.PNG)]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings-3.PNG)

Move over to the "Subnet Associations" tab and select the checkbox next to MyPrivateSN-1a-10.10.2.0/24 then click "Save".

[![]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings-4.PNG)]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings-4.PNG)

You should now see the green "Save Successful" like my screenshot below. We should now be able to route from our private subnet through our NAT instance and to the internet!

[![]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings-5.PNG)]({{ site.url }}/assets/article_images/VPC3/48-route-table-settings-5.PNG)

Go back to your SSH session and try the update again:
    yum update

[![]({{ site.url }}/assets/article_images/VPC3/50-private-yum-update.PNG)]({{ site.url }}/assets/article_images/VPC3/50-private-yum-update.PNG)

This time we should see yum accessing the appropriate repos as below.

[![]({{ site.url }}/assets/article_images/VPC3/50-private-yum-update-2.PNG)]({{ site.url }}/assets/article_images/VPC3/50-private-yum-update-2.PNG)

If your screen looks like mine, we have now verified internet connectivity from our private subnet through our NAT instance. **Hurrah!** If you have followed along this whole time you can give yourself a big pat on the back, as this process is one of the fundamentals that allot of AWS services depend on. Now we will go through cleaning out everything so we don't get a nasty bill in a month or so.

[![]({{ site.url }}/assets/article_images/VPC3/50-private-yum-update-3.PNG)]({{ site.url }}/assets/article_images/VPC3/50-private-yum-update-3.PNG)

Navigate to the "EC2 Dashboard" and down to the "Instances" tab, select all three instances we used for this tutorial, click "Actions", then "Instance State" and finally "Terminate".

[![]({{ site.url }}/assets/article_images/VPC3/51-terminate-ec2.png)]({{ site.url }}/assets/article_images/VPC3/51-terminate-ec2.png)

You should see all the Instances go from active to shutting down to terminated (it may take some time).

[![]({{ site.url }}/assets/article_images/VPC3/51-terminate-ec2-2.png)]({{ site.url }}/assets/article_images/VPC3/51-terminate-ec2-2.png)

Navigate to the "VPC Dashboard" service, select "MyExampleVPC" click "Actions" then Delete VPC.

[![]({{ site.url }}/assets/article_images/VPC3/52-delete-VPC.png)]({{ site.url }}/assets/article_images/VPC3/52-delete-VPC.png)

Accept the warning and click "Yes Delete". 

[![]({{ site.url }}/assets/article_images/VPC3/52-delete-VPC-2.png)]({{ site.url }}/assets/article_images/VPC3/52-delete-VPC-2.png)



