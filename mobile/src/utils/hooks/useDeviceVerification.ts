// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useState, useEffect } from "react";
import * as forge from "node-forge";
import * as SecureStore from "expo-secure-store";
import { verifyDevice } from "../../api/customer/devices";
import { isAxiosError } from "axios";

export function useDeviceVerification() {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceConflict, setDeviceConflict] = useState(false);

  const generateKeys = () => {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const pubKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privKey = forge.pki.privateKeyToPem(keypair.privateKey);
    return { pubKey, privKey };
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
