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
  const [oid, setOid] = useState<string | null>(null);
  const [deviceVerified, setDeviceVerified] = useState(false);

  const getOid = async () => {
    const customerId = await SecureStore.getItemAsync("oid");
    setOid(customerId);
    return customerId;
  };

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
    await SecureStore.setItemAsync(oid + "_publicKey", pubKey);
    await SecureStore.setItemAsync(oid + "_privateKey", privKey);
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
    const customerId = await getOid();
    if (isNil(customerId)) {
      return;
    }
    setIsLoading(true);

    try {
      let pubKey = await SecureStore.getItemAsync(customerId + "_publicKey");
      let privKey = await SecureStore.getItemAsync(customerId + "_privateKey");
      if (isNil(pubKey) || isNil(privKey)) {
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
      const deviceRegistered = await SecureStore.getItemAsync(
        customerId + "_deviceRegistered"
      );
      if (isNil(deviceRegistered)) {
        const registeredTime =
          new Date().toISOString().split("T")[0] +
          " " +
          new Date().toTimeString().split(" ")[0];
        SecureStore.setItemAsync(
          customerId + "_deviceRegistered",
          "Registered at " + registeredTime
        );
      }
      setDeviceVerified(true);
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
    deviceVerified,
  };
}
