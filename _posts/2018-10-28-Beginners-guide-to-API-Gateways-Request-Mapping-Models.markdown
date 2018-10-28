---
layout: post
title: Beginners guide to API Gateways Request Mapping Models
date:   2018-10-28 12:15:00
categories: "AWS" 
tags:
image: /assets/article_images/APIGW-RequestModels/API-platforms.png
bg-color: white
---

Hello again and welcome back, 

[API Gateway](https://aws.amazon.com/api-gateway/) is my favourite service offered by AWS, it enabled me to build a RESTful API without ever having any real web-development experience. If you want a broader guide to everything API Gateway I suggest you head on over to [the official docs](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)


Today's guide will detail how to get started with API Gateways, [Request Mapping Models](https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html) or (JSON Schema Models). I personally found the official documentation and guides a little "wanting" from a beginners walkthrough point of view, so decided to make a guide that walks through the basic elements needed to get started.


While I was building a serverless API for a local charity I volunteer for, due to our architectural decisions (to keep each lambda functions code bundle separate), I was writing a lot of boiler-plate code, code that needed to be updated many times over, often manually. One day I came across the guide for API Gateway [Mapping Models](https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html) they seemed to be an ideal solution, I can remove all my codebased payload input validation and replace it with one mapping template, where it can be assigned to many lambda functions without changing any code! 


[Mapping Models](https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html) are [JSON Schema Models](https://json-schema.org/understanding-json-schema/). For the schema to be enforced on your API's methods, the methods need to have body validation enabled for the request, and they need to be assigned the correct model. To check these settings open the method with wich you want to apply the JSON schema model.

[![]({{ site.url }}/assets/article_images/APIGW-RequestModels/Method-Execution.png)]({{ site.url }}/assets/article_images/APIGW-RequestModels/Method-Execution.png)

Open up the Method Request section:

[![]({{ site.url }}/assets/article_images/APIGW-RequestModels/Method-Request.png)]({{ site.url }}/assets/article_images/APIGW-RequestModels/Method-Request.png)

Ensure that your settings are similar to the above circled settings.

I've created an example JSON schema to showcase the main functionality you need to get started (IMHO), objects, arrays and properties. 

```javascript
{
    "type": "array",
    "items": 
    {
        "type" : "object",
        "required": ["clinic", "name"]
        "properties" : 
        {
            "clinic" : { "type" : "string"},
            "name" : { "type" : "string"},
            "number" : { "type" : ["string", "number", "null"]},
            "postcode" : { "type" : ["string", "number", "null"]},      
        }
    }
}

```
Breaking down the example above into its core functions:

The JSON payload must be an array.
```javascript
{
    "type": "array",
    "items": 
    {
        ...

    }
}

```

The array must be made up of objects.
```javascript
        "type" : "object",
        "required": [...]
        "properties" : 
        {
           ...    
        }

```

The objects must contain any parameters defined in the "required" parameter. In this case "clinic" and "name".
```javascript
        "required": ["clinic", "name"]
```

Parameters of the object, whose keys match the defined keys below must be of the "type" specified. The following specifies "clinic" and "name" must be a "string" (and can not be null). "number" or "postcode" can be of type ["string", "number", "null"]
```javascript   
        "properties" : 
        {
            "clinic" : { "type" : "string"},
            "name" : { "type" : "string"},
            "number" : { "type" : ["string", "number", "null"]},
            "postcode" : { "type" : ["string", "number", "null"]},    
        }
```

Hopefully, you understand little more of basics of how to implement [JSON schema ](https://json-schema.org/understanding-json-schema/) payload verification using [AWS' API Gateways](https://aws.amazon.com/api-gateway/) [Request Mapping Models](https://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html) now. Moreover, hopefully, it saves you as much time as it did me :-)

Until next time.