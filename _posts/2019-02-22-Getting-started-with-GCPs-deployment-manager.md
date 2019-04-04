---
layout: post
title:  "Getting started with GCP's deployment manager."
date:   2019-02-22 14:34:25
categories: "GCP"
tags:
image: /assets/article_images/deployment-manager/dm.png
bg-color: white
---

Hello, and welcome back to another post by yours truly. Recently there has been a little change in my life, I got a new job, and with the new job came a career pivot. Where I was an AWS consultant, I am now a data engineer working exclusively with Google Cloud Platform (GCP) for a great little company called [Datisan](https://www.datisan.com.au). Data engineering is not new to me, a few of my AWS clients wanted data lakes and ingestion pipelines setup, the GCP side of things; however is/was brand new to me. 

The focus of this post is going to be getting started with deployment manager (DM), GCP's infrastructure as code (IAC) service, to hopefully let you avoid some of the pitfalls I came across.

Rather than re-hash information that is already publicly available I thought I would link you to some of the GCP documentation so you can get a better handle on the foundational concepts:

- [Google's Documentation](https://cloud.google.com/deployment-manager/docs/)
- [Google's Quickstart](https://cloud.google.com/deployment-manager/docs/quickstart)
- [Codelabs tutorial](https://codelabs.developers.google.com/codelabs/gcp-aws-deployment-manager/index.html?index=..%2F..index#0)

Okay, assuming you have read through the above links, you now know the basic's, time to share my insights (or lack of). So after sending you towards the official documentation, the first thing about DM you should know is that the documentation around is poor, really poor, compared to the rich eco-system of documentation, developer forums and guides provided by AWS for CloudFormation (CF) the GCP counterpart seems.. lacking. Which is actually what inspired these series of posts, to help fill out what I struggled with, so others don't have to.

**Python over jinja**

Deployment manager templates have to be written in one of two languages, jinja or Python, my advice to you. Don't bother with jinja. I started with jinja, coming from a YAML centric AWS background, I thought jinja would be the easiest to get started with, oh boy was I wrong. Python gives you "orders of magnitude" more control over your infrastructure/deployments, with the added abilities to import any library you choose, create helper-functions and most importantly, Python has the most significant source of examples on the internet and questions on StackOverflow. If you try to search for jinja detailed examples, you are going to have a tough time finding anything relevant. Python is broadly supported and also easy to get started with; for this reason, it is my pick out of the two deployment manager languages.

**Understand YAML's role in your stack**

Any deployment built with DM consists of two types of files, a YAML configuration file and a set of template files (as discussed earlier in either Python or jinja). Google docs refer to the YAML file as your "configuration" and any jinja or Python files as your "templates" so be aware of this when looking through the documentation. 

**Understand the deployment process**

The "configuration" (YAML) files mentioned above are what you use in combination with the following gcloud command to deploy your DM stack:
```
    gcloud deployment-manager deployments create some-deployment --config configFile.yaml
```
The gcloud cli reads your configuration file and pulls in all the template files referenced in the imports section, it then transfers all these files to the deployment manager service where it runs the code inside the configuration and the templates.

**Where to find the different supported resources**

As soon as you branch away from the quickstart guide, you'll quickly want to deploy infrastructure that means something to you, your customised deployment, with all the bespoke features deserving of a DM stack. First port of call should be the [Supported Resource Types](https://cloud.google.com/deployment-manager/docs/configuration/supported-resource-types) list from Google; these are the resources that are officially supported by GCP. The list is quite short, as they don't "officially" support much yet. If the resource you are looking for is not in the [Supported Resource Types](https://cloud.google.com/deployment-manager/docs/configuration/supported-resource-types) you can look at the list of [GCP provider Types](https://cloud.google.com/deployment-manager/docs/configuration/supported-gcp-types) these are currently in beta and as such can change without warning, but you'll find they support a much wider variety of resources. Don't be afraid about the beta tag, Google is pretty good with their betas, and they usually hit production without too many changes.

**The Google samples repository**

I started with DM by assembling pieces of other peoples deployments, the easiest way to do this (IMHO) is to have a browse through the [Google deployment manager samples repository](https://github.com/GoogleCloudPlatform/deploymentmanager-samples) as it has lots of really great examples for you to cannibalise. Its also super handy to see working examples of what is possible and what is not, to get started I suggest you clone a version of the samples repository locally, find the resource you want to deploy (from the links in the above step) and search all the files in the sample repository for your desired resource type. You'll quickly find a working version of a DM stack for the resource you want to deploy.

Hopefully the tips above allow you to get off to a roaring start with your deployment manager stack creation, next time on pebkac, I will supply a little quickstart template of my own, containing an advanced technique to deploy any resource provided by GCP (not just the ones in the above resource lists), stay tuned for more :-)

Until next time...

