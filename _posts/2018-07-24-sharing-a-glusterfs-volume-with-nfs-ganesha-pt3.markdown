---
layout: post
title:  "Sharing a GlusterFS volume with NFS-Ganesha on CentOS-7 pt3"
date:   2018-07-24 06:34:25
categories: "Linux"
tags: 
image: /assets/article_images/glusterfs-ganesha/glusterfs-ant.png
bg-color: white
---

Hello, and welcome back to the third and final instalment of the "Sharing a GlusterFS volume with NFS-Ganesha on CentOS-7" series. Today we follow on from [Last Time]({{ site.url }}/2018-08-10-sharing-a-glusterfs-volume-with-nfs-ganesha-pt2.html) to set up the LVM or Logical Volume Management, there are quite a few steps, but they are all pretty straightforward, so don't get daunted, we need to complete these steps on all four nodes. There is a pretty good write up explaining what I am doing here in more detail by [Digital ocean](https://www.digitalocean.com/community/tutorials/an-introduction-to-lvm-concepts-terminology-and-operations)

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

Now we’ll create a "notAsSimple" gluster volume, striped across two Nodes, then replicated to the other two servers, with an arbiter disk on Node1 and Node3. Then we disable gluster NFS. Do this on Node1.
<!--https://docs.gluster.org/en/v3/Administrator%20Guide/arbiter-volumes-and-quorum/-->

```bash 
sudo gluster volume create notAsSimple stripe 2 replica 3 arbiter 1 Node1:/bricks/demo/export Node2:/bricks/demo/export Node1:/bricks/arbiter/export Node3:/bricks/demo/export Node4:/bricks/demo/export Node3:/bricks/arbiter/export
sudo gluster volume set notAsSimple nfs.disable on  
sudo gluster volume start notAsSimple  
```

Then we enable Ganesha. Still on Node1.

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

Hopefully, everything is working now and with the help of [kkeithley's](http://blog.gluster.org/2015/10/linux-scale-out-nfsv4-using-nfs-ganesha-and-glusterfs-one-step-at-a-time/) post, [my original post]({{ site.url }}/linux/2017/08/17/sharing-a-glusterfs-volume-with-nfs-ganesha.html), [my second post]({{ site.url }}/2018-08-10-sharing-a-glusterfs-volume-with-nfs-ganesha-pt2.html) and this post, you have a good hang of what is required to set up a replicated gluster volume and then export it with NFS-Ganesha.

Until next time!
 
