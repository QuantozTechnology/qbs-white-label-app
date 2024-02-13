import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
//ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

describe("signMessage noble", () => {
  it("message is deterministic", async () => {
    //var privKey = ed.utils.randomPrivateKey();

    const privKey =
      "6e2dd227481f9d65e92f7be424876015eb54e59826206098acbc442fd371dab4";

    const privateKey = Buffer.from(privKey, "hex");
    const privateKeyHex = privateKey.toString("hex");
    const privateKeyB64 = privateKey.toString("base64");
    expect(privateKeyHex).toEqual(
      "6e2dd227481f9d65e92f7be424876015eb54e59826206098acbc442fd371dab4"
    );
    expect(privateKeyB64).toEqual(
      "bi3SJ0gfnWXpL3vkJIdgFetU5ZgmIGCYrLxEL9Nx2rQ="
    );

    const hexResult = ed.getPublicKey(privateKey);
    const pubKeyB64 = Buffer.from(hexResult).toString("base64");

    expect(pubKeyB64).toEqual("gwZ+LyQ+VLaIsWeSq3QFh+WaZHNgl07pXul++BsezoY=");

    const message = "HELLO";
    const messageBytes = Buffer.from(message, "utf-8");
    const signature = ed.sign(messageBytes, privateKey);
    const signatureB64 = Buffer.from(signature).toString("base64");
    expect(signatureB64).toEqual(
      "N+iGXaCIwZO/jQa2az6VTiwgr/vJsQ7sp3IsOx+79ujgK3YsY0PJerZVLLxT2YIgHcDD+cfGluY+ouzk0F+hBA=="
    );
  });
});
