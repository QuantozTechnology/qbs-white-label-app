// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import { getSignatureHeaders } from "../axios";
import { Buffer } from "buffer";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

describe("signMessage noble", () => {
  it("signature and key generation is deterministic", () => {
    //var privKey = ed.utils.randomPrivateKey();

    const privKey =
      "6e2dd227481f9d65e92f7be424876015eb54e59826206098acbc442fd371dab4";

    const privateKey = Buffer.from(privKey, "hex");
    const privateKeyHex = privateKey.toString("hex");
    const privateKeyB64 = privateKey.toString("base64");

    const hexResult = ed.getPublicKey(privateKey);
    const pubKeyB64 = Buffer.from(hexResult).toString("base64");

    expect(privateKeyHex).toEqual(
      "6e2dd227481f9d65e92f7be424876015eb54e59826206098acbc442fd371dab4"
    );
    expect(privateKeyB64).toEqual(
      "bi3SJ0gfnWXpL3vkJIdgFetU5ZgmIGCYrLxEL9Nx2rQ="
    );
    expect(pubKeyB64).toEqual("gwZ+LyQ+VLaIsWeSq3QFh+WaZHNgl07pXul++BsezoY=");
  });

  it("signature is deterministic", () => {
    const privKey =
      "6e2dd227481f9d65e92f7be424876015eb54e59826206098acbc442fd371dab4";

    const privateKey = Buffer.from(privKey, "hex");

    const message = "HELLO";
    const messageBytes = Buffer.from(message, "utf-8");
    const signature = ed.sign(messageBytes, privateKey);
    const signatureB64 = Buffer.from(signature).toString("base64");
    expect(signatureB64).toEqual(
      "N+iGXaCIwZO/jQa2az6VTiwgr/vJsQ7sp3IsOx+79ujgK3YsY0PJerZVLLxT2YIgHcDD+cfGluY+ouzk0F+hBA=="
    );
  });
});

describe("send signature to server", () => {
  
  it("message is deterministic", async () => {
    const date = new Date("2020-01-01T00:00:00Z");

    const privKey = "bi3SJ0gfnWXpL3vkJIdgFetU5ZgmIGCYrLxEL9Nx2rQ=";

    const data = { message: "HELLO" };

    // we supply the date directly to the function
    // trying to mock it using fakeTimers and setSystemTime did not work
    // it was unable to resolve the hook (whatever hook that might be) at the end of the call
    const sigData = getSignatureHeaders(date, data, privKey);

    expect(sigData.signature).toEqual(
      "ksnz8fzvQerq3uTgYYisKqLu/tZJWcYQYPW4UAl62FREqm6T9PDGiAIjwiePL6SC4jE7X59r8llhUQqgQKQ1DQ=="
    );
    expect(sigData.timestamp).toEqual("1577836800");
  });
});
