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

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

export function useDeviceVerification() {
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
    otpSeed?: string
  ) => {
    await SecureStore.setItemAsync("publicKey", pubKey);
    await SecureStore.setItemAsync("privateKey", privKey);
    if (otpSeed) {
      await SecureStore.setItemAsync("otpSeed", otpSeed);
    }
  };

  useEffect(() => {
    const setupAndVerifyDeviceSecurity = async () => {
      setIsLoading(true);

      try {
        let pubKey = await SecureStore.getItemAsync("publicKey");
        let privKey = await SecureStore.getItemAsync("privateKey");

        if (!pubKey || !privKey) {
          const keys = generateKeys();
          pubKey = keys.pubKey;
          privKey = keys.privKey;

          await storeKeys(pubKey, privKey);
        }

        const { data } = await verifyDevice({ publicKey: pubKey });

        await storeKeys(pubKey, privKey, data.value.otpSeed);
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

    setupAndVerifyDeviceSecurity();
  }, []);

  return {
    error,
    isLoading,
    deviceConflict,
  };
}
