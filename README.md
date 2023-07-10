---
title: aws singature v4
description: sign an request with aws signature v4
author: haimtran
publishedDate: 07/06/2023
date: 2023-07-06
---

## Introduction

[GitHub](https://github.com/cdk-entest/aws-sigv4-ts-demo/tree/master) this note shows how to use AWS Signature V4 to sign a request

## Setup Project

Let create a new typescript project

```bash
npm init
```

Install typescript

```bash
npm install typescript --save-dev
```

Install ambient Node.js types for typescript

```bash
npm install @types/node --save-dev
```

Create a tsconfig.json as following

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["es6"],
    "allowJs": true,
    "outDir": "build",
    "rootDir": "src",
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

## Create Signature

There are different ways or tools to create a signature v4

- step by step following [the docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/create-signed-request.html)
- use @aws-sdk/signature-v4 or @aws-sdk/signature-v4-crt [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-signature-v4/)
- use python lib [here](https://github.com/aws-samples/sigv4a-signing-examples/blob/main/python/sigv4a_sign.py)

Install dependencies

```bash
npm install @aws-sdk/signature-v4 @aws-sdk/protocol-http @aws-crypto/sha256-js axios
```

Create a signature signer

```ts
const signer = new SignatureV4({
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  region: "us-east-1",
  service: "s3",
  sha256: Sha256,
});
```

Create a request

```ts
const request = new HttpRequest({
  path: new URL(config.endpoint).pathname,
  hostname: new URL(config.endpoint).hostname,
  protocol: "https",
  method: "GET",
  headers: {
    host: new URL(config.endpoint).hostname,
  },
});
```

Sign the request

```ts
signer
  .sign(request, {
    signingRegion: "us-east-1",
    signingService: "s3",
    signingDate: new Date(),
  })
  .then((response) => {
    console.log(response);

    axios
      .get(config.endpoint, {
        headers: response.headers,
        responseType: "stream",
      })
      .then((response) => {
        console.log(response);
        response.data.pipe(fs.createWriteStream("./tree.jpg"));
      })
      .catch((error) => {
        console.log(error);
      });
  });
```

## Send Request

After signed request, we can send the request to an S3 endpoint to get an image object

```js
signer
  .sign(request, {
    signingRegion: "us-east-1",
    signingService: "s3",
    signingDate: new Date(),
  })
  .then((response) => {
    console.log(response);

    axios
      .get(config.endpoint, {
        headers: response.headers,
        responseType: "stream",
      })
      .then((response) => {
        console.log(response);
        response.data.pipe(fs.createWriteStream("./tree.jpg"));
      })
      .catch((error) => {
        console.log(error);
      });
  });
```

## Reference

- [create signature v4 docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/create-signed-request.html)

- [@aws-sdk/signature-v4](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-signature-v4/)

- [@aws-sdk/signature-v4-crt](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-signature-v4/)

- [python example signature v4](https://github.com/aws-samples/sigv4a-signing-examples)

- [tsconfig lib and target](https://www.claritician.com/typescript-lib-vs-target-what-s-the-difference)
