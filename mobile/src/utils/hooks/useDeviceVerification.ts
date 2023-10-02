// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useState } from "react";
import { useKeyGeneration } from "./useKeyGeneration";
import * as SecureStore from "expo-secure-store";
import * as Sentry from "sentry-expo";
import { verifyDevice } from "../../api/customer/devices";
import { isAxiosError } from "axios";

export function useDeviceVerification() {
  const { isGeneratingKeys, getOrGenerateKeys } = useKeyGeneration();
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceConflict, setDeviceConflict] = useState(false);

  async function storeKeys(
    pubKey: string,
    privKey: string,
    otpSeed: string
  ): Promise<void> {
    try {
      await SecureStore.setItemAsync("publicKey", pubKey);
      await SecureStore.setItemAsync("privateKey", privKey);
      await SecureStore.setItemAsync("otpSeed", otpSeed);
    } catch (e) {
      setError({ message: "Error storing keys in secure store" });
      Sentry.Native.captureException(e, {
        tags: { component: "WelcomeStack" },
        extra: { reason: "Could not store keys in secure store" },
      });
    }
  }

  async function isSecureStoreAvailable(): Promise<boolean> {
    return SecureStore.isAvailableAsync();
  }

  async function setupAndVerifyDeviceSecurity(): Promise<void> {
    setIsLoading(true);
    try {
      const { pubKey, privKey } = await getOrGenerateKeys();
      const { data } = await verifyDevice({ publicKey: pubKey });

      if (await isSecureStoreAvailable()) {
        await storeKeys(pubKey, privKey, data.value.otpSeed);
        // Axios headers will be set in the interceptor for requests (see axios.ts)
      } else {
        setError({ message: "Secure store is not available" });
      }
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        if (e.response?.status === 409) {
          // in case the user has a device registered already
          setDeviceConflict(true);
        }
      }
      setError({ message: "Error verifying device" });
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isGeneratingKeys,
    setupAndVerifyDeviceSecurity,
    error,
    isLoading,
    deviceConflict,
  };
}
