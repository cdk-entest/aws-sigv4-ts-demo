import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { config } from "./config";
import axios from "axios";
import * as fs from "fs";

// request signer
const signer = new SignatureV4({
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  region: "us-east-1",
  service: "s3",
  sha256: Sha256,
});

// creata a request
const request = new HttpRequest({
  path: new URL(config.endpoint).pathname,
  hostname: new URL(config.endpoint).hostname,
  protocol: "https",
  method: "GET",
  headers: {
    host: new URL(config.endpoint).hostname,
  },
});

// sign the request
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
