---
layout: post
title:  "Sharing a striped, replicated GlusterFS volume with NFS-Ganesha on CentOS-7 pt2"
date:   2018-07-17 06:34:25
categories: "Linux"
tags: featured
image: /assets/article_images/glusterfs-ganesha/glusterfs-ant.png
---

<br>

Hello again! Today on pebkac we are expanding on our two node GlusterFS from [last time]({{ site.url }}/linux/2017/08/17/sharing-a-glusterfs-volume-with-nfs-ganesha.html) taking in some of the feedback I received. We will expand the cluster out to four nodes; we will stripe two of the nodes and replicate the striped volumes to the other two nodes, we will be implementing Linux Volume Manager (LVM), we will have two arbiter disks and trying not to mix in deprecated commands. If you'd like a better guide to getting started with gluster + ganesha, I would suggest going back to my [original post]({{ site.url }}/linux/2017/08/17/sharing-a-glusterfs-volume-with-nfs-ganesha.html), or even further back to [kkeithley's](http://blog.gluster.org/2015/10/linux-scale-out-nfsv4-using-nfs-ganesha-and-glusterfs-one-step-at-a-time/) post which describes the first few steps well.

Versions:
- Centos-release: 7-3.1611.el7.centos.x86_64
- Kernel: 3.10.0-514.el7.x86_64
- NFS-Ganesha: 2.4.5-1.el7.x86_64
- NFS-Ganesha-Gluster: 2.4.5-1.el7.x86_64
- Glusterfs-Ganesha: 3.10.3-1.el7.x86_64

Starting with four centos7 nodes in the same subnet, all with a second disk/drive at /dev/sdb, and two of them (Node1 and Node3) with a third equally sized drive at /dev/sdc (the arbiter disks). See my Architecture diagram below:

[![]({{ site.url }}/assets/article_images/glusterfs-ganesha/gluster-ganesha-pt2-diagram.png)]({{ site.url }}/assets/article_images/glusterfs-ganesha/gluster-ganesha-pt2-diagram.png)
 
On each node, configure your network interface (NiC), and a virtual IP for that interface to match the above IP address'. To configure a virtual IP, create another NiC config file with ":1" appended, in the same location as your original NiC config file, as below.

My config files for the [NiC's' on Node1]({{ site.url}}/assets/config_files/gluster-ganesha-pt2/Node1-Nics.txt), [NiC's on Node2]({{ site.url}}/assets/config_files/gluster-ganesha-pt2/Node2-Nics.txt), [NiC's' on Node3]({{ site.url}}/assets/config_files/gluster-ganesha-pt2/Node3-Nics.txt) and [NiC's on Node4]({{ site.url}}/assets/config_files/gluster-ganesha-pt2/Node4-Nics.txt) My files are designed for a 192.168.4.0/24 subnet with a gateway of 192.168.4.1. Run the following commands on all nodes, replacing the contents of the files with my configs linked above.

```bash
sudo vi /etc/sysconfig/network-scripts/ifcfg-ens160  
sudo vi /etc/sysconfig/network-scripts/ifcfg-ens160:1 
sudo ifup ifcfg-ens160:1
sudo systemctl restart network  
```
You should be able to ping the virtual IP's now. Run this on any node.

```bash 
ping 192.168.4.12 
ping 192.168.4.14 
ping 192.168.4.16
ping 192.168.4.18 

``` 
   
Configure your /etc/hosts file with the IP's and Virtual IP's of all the nodes intended for the cluster; you can see [my /etc/hosts file.]({{ site.url}}/assets/config_files/gluster-ganesha-pt2/hosts.txt). Run this on all nodes, and replace the contents with my host file.


```bash
sudo vi /etc/hosts 
```

Here I turn off the firewalld service. **Warning: This is not, best practice, you should make exceptions on the FW for all the nodes in the cluster.** Run this on both nodes.

```bash
sudo systemctl stop firewalld.service   
sudo chkconfig firewalld off  
```

Here we stop NetworkManager and keep it off. Run this on both nodes.

```bash  
sudo systemctl stop NetworkManager  
sudo chkconfig NetworkManager off  
```

Then we enable the network service. Run this on both nodes.

```bash  
sudo systemctl start network    
sudo chkconfig network on  
```

Now we need to install all the following packages. You don't need nano, but it's my preferred editor. Run this on all nodes.

```bash
sudo yum -y install centos-release-gluster  
sudo yum -y install glusterfs-server   
sudo yum -y install glusterfs-ganesha    
sudo yum -y install nano  
sudo yum -y update
``` 
 
Start the gluster service, ensure it is always started, then check the status. Run this on both nodes.

```bash  
sudo systemctl enable glusterd 
sudo systemctl start glusterd
sudo chkconfig glusterd on
sudo systemctl status glusterd   
 ```

Here we setup passwordless ssh between the nodes, you have to enter the root account password 4 times. Run the following from Node1.

```bash
sudo ssh-keygen -f /var/lib/glusterd/nfs/secret.pem
sudo ssh-copy-id -i /var/lib/glusterd/nfs/secret.pem.pub root@Node1
sudo ssh-copy-id -i /var/lib/glusterd/nfs/secret.pem.pub root@Node2
sudo ssh-copy-id -i /var/lib/glusterd/nfs/secret.pem.pub root@Node3
sudo ssh-copy-id -i /var/lib/glusterd/nfs/secret.pem.pub root@Node4
sudo scp /var/lib/glusterd/nfs/secret.* Node1:/var/lib/glusterd/nfs/ 
sudo scp /var/lib/glusterd/nfs/secret.* Node2:/var/lib/glusterd/nfs/
sudo scp /var/lib/glusterd/nfs/secret.* Node3:/var/lib/glusterd/nfs/
sudo scp /var/lib/glusterd/nfs/secret.* Node4:/var/lib/glusterd/nfs/
```
You can then confirm passwordless ssh. Run the following from Node1.

```bash
ssh -oPasswordAuthentication=no -oStrictHostKeyChecking=no -i/var/lib/glusterd/nfs/secret.pem root@Node2  
``` 
 
We then build the gluster cluster. Do this from Node1.

```bash 
gluster peer probe Node2 Node3 Node4
gluster peer status 
```

Enable the Gluster shared state volume. Do this on Node1.

```bash
gluster volume set all cluster.enable-shared-storage enable  
 ```

Wait for gluster_shared_volume to mount on all the nodes, the below code should show a volume mounted to /var/run/gluster/shared_storage/ on every node before proceeding.

```bash
mount | grep gluster_sha*
```

Create the ganesha.conf and ganesha-ha.conf files on Node1.
<br>My files:<br>
[Ganesha.conf]({{ site.url}}/assets/config_files/gluster-ganesha-pt2/ganesha.conf.txt)
<br>[Ganesha-ha.conf]({{ site.url}}/assets/config_files/gluster-ganesha-pt2/ganesha-ha.conf.txt)

```bash
sudo mkdir /var/run/gluster/shared_storage/nfs-ganesha 
sudo nano /var/run/gluster/shared_storage/nfs-ganesha/ganesha.conf  
sudo nano /var/run/gluster/shared_storage/nfs-ganesha/ganesha-ha.conf 
```

Enable and start the Pacemaker pcsd. Run this on all four nodes.

```bash   
sudo systemctl enable pcsd 
sudo systemctl start pcsd 
sudo chkconfig pcsd on 
sudo systemctl status pcsd 
```

Set a password (in this case demopass) for the user ‘hacluster’. Use the same password, run this on all four nodes.

```bash
sudo echo demopass | passwd --stdin hacluster  
```

Perform cluster auth between the nodes, run the below code from Node1. You need to enter the username "hacluster" and the password you set above in this case "demopass".

```bash
sudo pcs cluster auth Node1 
sudo pcs cluster auth Node2  
sudo pcs cluster auth Node3 
sudo pcs cluster auth Node4  

```

Here we will setup the LVM or Logical Volume Management, there are quite a few steps, but they are all pretty straightforward, so don't get daunted, we need to complete these steps on all four nodes. There is a pretty good write up explaining what I am doing here in more detail by [Digital ocean](https://www.digitalocean.com/community/tutorials/an-introduction-to-lvm-concepts-terminology-and-operations)

```bash
Lsblk 
```

Open the format disk utill for the gluster disk (in this case /dev/sdb)

```bash
fdisk /dev/sdb
```

The first command you enter should be "n" for new partition:

```bash
Command (m for help): n 
```
Then type in "p" for primary partition:

```bash
Select (default p): p 
```
Partition number should be 1

```bash
Partition number (1-4, default 1): 1 
```
Leave the defaults for the first sector
```bash
First sector (2048-104857599, default 2048): <ENTER DEFAULT> 

Using default value 2048 
```

Leave the default for the second sector (defaults to 100%)

```bash
Last sector, +sectors or +size{K,M,G} (2048-104857599, default 104857599): <ENTER DEFAULT> 

```

Now enter "t"

```bash
Command (m for help): t 
```

If it asks you what partition select 1

```bash
Partition number (1, default 1): 1 
```

Enter the hex code 8e, which stands for Linux LVM

```bash
Hex code (type L to list all codes): 8e 
```

You should now see the following.

```bash
Changed type of partition 'Linux' to 'Linux LVM' 
```
Finally, we write the changes to disk with "w" 

```bash
Command (m for help): w 
```
You should now see the following.

```bash
The partition table has been altered! 
Calling ioctl() to re-read partition table. 
Syncing disks. 
```

Now check the disks are showing up as 8e or LVM disks. 

```bash
fdisk -l | grep LVM 
```
You should now see the following.
```bash
/dev/sdb1            2048    52427775    26212864   8e  Linux LVM 
```

Now the disks are formatted we can create the physical volumes. 

```bash
pvcreate /dev/sdb1
```

You should now see the following.

```bash
Physical volume "/dev/sdb1" successfully created. 
```

Let's create vg1 against the new physical volumes. 

```bash
vgcreate vg1 /dev/sdb1  
```

You should now see the following.

```bash
Volume group "vg1" successfully created. 
```

Confirm creation with vgdisplay 

```bash
vgdisplay 
```

You should now see something similar to the following.
```bash

  --- Volume group --- 

  VG Name               vg1 

  System ID 

  Format                lvm2 

  Metadata Areas        2 

  Metadata Sequence No  1 

  VG Access             read/write 

  VG Status             resizable 

  MAX LV                0 

  Cur LV                0 

  Open LV               0 

  Max PV                0 

  Cur PV                2 

  Act PV                2 

  VG Size               49.99 GiB 

  PE Size               4.00 MiB 

  Total PE              12798 

  Alloc PE / Size       0 / 0 

  Free  PE / Size       12798 / 49.99 GiB 

  VG UUID               Rjt3AJ-8qnK-Bsp8-0Rrl-IFCR-pcrz-Z6fEtE 

```
 
Now we need to create the logical volume group, using 100% of the available disk. 

```bash
lvcreate -n gluster-brick -l 100%FREE /dev/vg1 
```

You should now see the following.
```bash
  Logical volume "gluster-brick" created. 
```

Confirm with lvdisplay 

```bash
lvdisplay 
```

You should now see the following.
```bash
  --- Logical volume --- 

  LV Path                /dev/vg1/gluster-brick

  LV Name                gluster-brick

  VG Name                vg1 

  LV UUID                y0uQZi-qBF6-Sbky-gr8L-wDBO-wKIj-aFL1ME 

  LV Write Access        read/write 

  LV Creation host, time demo.qgi.qld.gov.au, 2018-05-08 15:17:55 +1000 

  LV Status              available 

  # open                 0 

  LV Size                <25.00 GiB 

  Current LE             6399 

  Segments               1 

  Allocation             inherit 

  Read ahead sectors     auto 

  - currently set to     8192 

  Block device           253:7 
```

Here we make our bricks directory, format the volume group, add the mount configuration to the /etc/fstab file, mount the drive and create our export dir. Do this on all four nodes.

```bash
sudo mkdir -p /bricks/demo  
mkfs -t ext4 /dev/vg1/gluster-brick
sudo echo '/dev/vg1/gluster-brick        /bricks/demo    ext4    defaults        0 0' >> /etc/fstab 
sudo mount /dev/vg1/gluster-brick /bricks/demo  
sudo mkdir -p /bricks/demo/export 
```

Now we’ll create a "notAsSimple" gluster volume, striped across two Nodes, then replicated to the other two servers ,with an arbiter disk on Node1 and Node3.Then we will disable gluster nfs. Do this on Node1.
<!--https://docs.gluster.org/en/v3/Administrator%20Guide/arbiter-volumes-and-quorum/-->

```bash 
sudo gluster volume create notAsSimple stripe 2 replica 3 arbiter 1 Node1:/bricks/demo/export Node2:/bricks/demo/export Node1:/bricks/arbiter/export Node3:/bricks/demo/export Node4:/bricks/demo/export Node3:/bricks/arbiter/export
sudo gluster volume set notAsSimple nfs.disable on  
sudo gluster volume start notAsSimple  
```

Then we enable ganesha. Still on Node1.

```bash 
sudo gluster nfs-ganesha enable  
```

Finally, we export the volume. Still on Node1.

 ```bash
sudo gluster vol set notAsSimple ganesha.enable on 
```

Everything should now be up and running you can test mount the NFS volume using one of the virtual IP's.

 ```bash
sudo mount node1v:/notAsSimple /mnt/NFS-ganesha 
 ```

Hopefully, everything is working now and with the help of [kkeithley's](http://blog.gluster.org/2015/10/linux-scale-out-nfsv4-using-nfs-ganesha-and-glusterfs-one-step-at-a-time/) post, [my original post]({{ site.url }}/linux/2017/08/17/sharing-a-glusterfs-volume-with-nfs-ganesha.html) and this post you have a good hang of what is required to set up a replicated gluster volume and then export it with NFS-Ganesha.

Until next time!
 
