// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useState, useEffect } from "react";
import * as ed from "@noble/ed25519";
import "react-native-get-random-values";
import * as SecureStore from "expo-secure-store";
import { verifyDevice } from "../../api/customer/devices";
import { isAxiosError } from "axios";
import { sha512 } from "@noble/hashes/sha512";
import { fromByteArray } from "react-native-quick-base64";
import { isNil } from "lodash";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

export function useDeviceVerification(shouldVerify: boolean) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceConflict, setDeviceConflict] = useState(false);

  const generateKeys = () => {
    const privKey = ed.utils.randomPrivateKey();
    const pubKey = ed.getPublicKey(privKey);

    const privKeyBase64 = fromByteArray(privKey);
    const pubKeyBase64 = fromByteArray(pubKey);
    return { pubKey: pubKeyBase64, privKey: privKeyBase64 };
  };

  const storeKeys = async (
    pubKey: string,
    privKey: string,
    otpSeed?: string | null
  ) => {
    await SecureStore.setItemAsync("publicKey", pubKey);
    await SecureStore.setItemAsync("privateKey", privKey);
    if (otpSeed) {
      await SecureStore.setItemAsync("otpSeed", otpSeed);
    }
  };

  useEffect(() => {
    if (!shouldVerify) {
      return;
    }
    setupAndVerifyDeviceSecurity();
  }, [shouldVerify]);

  const setupAndVerifyDeviceSecurity = async () => {
    setIsLoading(true);

    try {
      let pubKey = await SecureStore.getItemAsync("publicKey");
      let privKey = await SecureStore.getItemAsync("privateKey");

      if (!pubKey || !privKey) {
        const keys = generateKeys();
        pubKey = keys.pubKey;
        privKey = keys.privKey;

        await storeKeys(pubKey, privKey, null);
      }
      const verificationResult = await verifyDevice({ publicKey: pubKey });
      // Handle the case where the API response is not as expected, so we don't run into errors
      try {
        const { data } = verificationResult;
        const otpSeed = isNil(data?.value?.otpSeed)
          ? null
          : data?.value?.otpSeed;
        if (otpSeed) {
          await storeKeys(pubKey, privKey, otpSeed);
        }
      } catch (e) {
        console.log("error in verifyDevice", e);
      }
    } catch (e: unknown) {
      if (isAxiosError(e) && e.response?.status === 409) {
        setDeviceConflict(true);
      } else {
        setError(new Error("Error verifying device: " + e));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    deviceConflict,
  };
}
