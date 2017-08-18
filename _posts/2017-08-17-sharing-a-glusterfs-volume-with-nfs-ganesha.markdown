---
layout: post
title:  "Sharing a GlusterFS volume with NFS-Ganesha on CentOS-7"
date:   2017-08-17 06:34:25
categories: "Linux"
tags: featured
image: /assets/article_images/glusterfs-ganesha/glusterfs-ant.png
---

Hello again! today on pebkac we are creating a two node GlusterFS cluster on CentOS-7 to host a highly available NFSv4 share. The volume (Glusterfs terminoligy for the virtualised disk group spread across CentOS nodes) will handle the file replication and locking. The volume will be shared out with nfs-Ganesha enabling the automatic failover of the NFS share, in the event that the node you have mounted the share on... dissapears.

If your looking for a great guide to get you started I suggest you go to this post by [kkeithley](http://blog.gluster.org/2015/10/linux-scale-out-nfsv4-using-nfs-ganesha-and-glusterfs-one-step-at-a-time/) and complete the first two steps. I found that kkeithleys blog worked for the first two steps "crawl and "walk", but I couldnt manage to complete the "run" section.  This blog is more intended to be a continuation from kkeithlets post above adressing the areas where the Glusterfs [3.9 release](https://gluster.readthedocs.io/en/latest/release-notes/3.9.0/) changed things.

Starting with two centos7 nodes in the same subnet with a second drive at /dev/sdb (if you dont you may have to adjust my files appropriatley) 
 
On each node configure your network interface (NiC) and a virtual IP for that interface, you configure a virtual IP by creating another NiC config file with ":1" appended, as below.

My config files for the [NiC's' on Node1]({{ site.url}}/assets/config_files/gluster-ganesha/Node1-Nics.txt) and [NiC's on Node2]({{ site.url}}/assets/config_files/gluster-ganesha/Node2-Nics.txt) my files are designed for a 192.168.4.0/24 subnet with a gateway of 192.168.4.1.

```bash
sudo vi /etc/sysconfig/network-scripts/ifcfg-ens160  
sudo vi /etc/sysconfig/network-scripts/ifcfg-ens160:1 
sudo ifup ifcfg-ens160:1
sudo service network restart 
```
You should be able to ping the virtual IP's now.

```bash 
ping 192.168.4.12 
ping 192.168.4.14 

``` 
   
Configure yours /etc/hosts file with the IP's and Virtual IP's of all the nodes intended for the cluster, you can see my [/etc/hosts file.]({{ site.url}}/assets/config_files/gluster-ganesha/hosts.txt)


```bash
sudo vi /etc/hosts 
```

Here I turn off the frewalld service and make sure it is always of. Warning this is not best practise, you should make exceptions on the FW for all the nodes in the cluster but that is outside the scope of this tutorial.

```bash
sudo systemctl stop firewalld.service   
sudo chkconfig firewalld off  
```

Here we stop NetworkManager and keep it off..

```bash  
sudo service NetworkManager stop  
sudo chkconfig NetworkManager off  
```

Then we enable the network service.

```bash  
sudo sudo service network restart   
sudo chkconfig network on  
```

Now we need to install all the following packages. you dont need nano, but its my preferred editor.

```bash
sudo yum -y install centos-release-gluster  
sudo yum -y install glusterfs-server   
sudo yum -y install glusterfs-ganesha    
sudo yum -y install nano  
sudo yum -y update
``` 
 
Then we start the gluster service and ensure it is always started, then check if it is started.

```bash  
sudo systemctl enable glusterd 
sudo systemctl start glusterd
sudo chkconfig glusterd on
sudo service glusterd status  
 ```

From Node1 run the following.

```bash
sudo ssh-keygen -f /var/lib/glusterd/nfs/secret.pem
sudo ssh-copy-id -i /var/lib/glusterd/nfs/secret.pem.pub root@Node1
sudo ssh-copy-id -i /var/lib/glusterd/nfs/secret.pem.pub root@Node2
sudo scp /var/lib/glusterd/nfs/secret.* Node1:/var/lib/glusterd/nfs/ 
sudo scp /var/lib/glusterd/nfs/secret.* Node2:/var/lib/glusterd/nfs/
```
You can then confirm passwordless ssh by running the following.

```bash
ssh -oPasswordAuthentication=no -oStrictHostKeyChecking=no -i/var/lib/glusterd/nfs/secret.pem root@Node2  
``` 
 
We then build the gluster cluster from Node1.

```bash 
gluster peer probe Node2 
gluster peer status 
```

Enable the Gluster shared state volume.

```bash
gluster volume set all cluster.enable-shared-storage enable  
 ```

Wait for gluster_shared_volume to mount on all the nodes before proceeding, the below code should show it mounted to /var/run/gluster/shared_storage/ on every node.

```bash
mount | grep gluster_sha*
```

Create the ganesha.conf and ganesha-ha.conf files on Node1.
<br>My files:,<br>
[Ganesha.conf]({{ site.url}}/assets/config_files/gluster-ganesha/ganesha.conf.txt)
<br>[Ganesha-ha.conf]({{ site.url}}/assets/config_files/gluster-ganesha/ganesha-ha.conf.txt)

```bash
sudo mkdir /var/run/gluster/shared_storage/nfs-ganesha 
sudo nano /var/run/gluster/shared_storage/nfs-ganesha/ganesha.conf  
sudo nano /var/run/gluster/shared_storage/nfs-ganesha/ganesha-ha.conf 
```

Enable and start the Pacemaker pcsd on all nodes.

```bash   
sudo systemctl enable pcsd 
sudo systemctl start pcsd 
sudo chkconfig pcsd on 
sudo systemctl status pcsd 
```

Set a password (in this case demopass) for the user ‘hacluster’ on all nodes. Use the same password for all nodes.

```bash
sudo echo demopass | passwd --stdin hacluster  
```

Perform cluster auth between the nodes. Username is ‘hacluster’, Password is the one you used in the precious step, run this on Node1. You will need to enter the username "hacluster" and the password you set above in this case "demopass".

```bash
sudo pcs cluster auth Node1 
sudo pcs cluster auth Node2  
```

Here we make our bricks directory format the sdb drive add the mount configuration to the /etc/fstab file mount the drive and create our export dir.

```bash
sudo mkdir -p /bricks/demo  
sudo mkfs.xfs /dev/sdb -f 
sudo echo '/dev/sdb        /bricks/demo    xfs    defaults        0 0' >> /etc/fstab 
sudo mount /dev/sdb /bricks/demo  
sudo mkdir -p /bricks/demo/export 
```

Now we’ll create a simple gluster volume and disable gluster nfs.

```bash 
sudo gluster volume create simple replica 2 Node1:/bricks/demo/export Node2:/bricks/demo/export 
sudo gluster volume set simple nfs.disable on  
sudo gluster volume start simple  
```

Then we enable ganesha.

```bash 
sudo gluster nfs-ganesha enable  
```

Finally we export the volume.

 ```bash
sudo gluster vol set simple ganesha.enable on 
```

 You can test mount the NFS volume using one of the virtual IP's.

 ```bash
sudo mount node1v:/simple /mnt/NFS-ganesha 
 ```

Next time come back for some testing and thoughts on scaling out from a simple 2 node cluster. Thanks for following along.
 
 
 
 