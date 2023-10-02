// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useState } from "react";
import * as forge from "node-forge";
import * as SecureStore from "expo-secure-store";

export const useKeyGeneration = () => {
  const [isFetchingKeys, setIsFetchingKeys] = useState(false);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

  // Making the keys generation async, otherwise it blocks the whole JS event loop for 1 minute on devices. Also, this is the only way to make sure the component calling this hook gets updates on the key creation process
  const generateKeysAsync = () => {
    return new Promise<{
      publicKey: forge.pki.PublicKey;
      privateKey: forge.pki.PrivateKey;
    }>((resolve, reject) => {
      forge.pki.rsa.generateKeyPair(
        { bits: 2048, workers: -1 },
        (err, keypair) => {
          if (err) {
            reject(err);
          } else {
            resolve(keypair);
          }
        }
      );
    });
  };

  const getOrGenerateKeys = async (): Promise<{
    pubKey: string;
    privKey: string;
  }> => {
    setIsFetchingKeys(true);
    const pubKeyFromStore = await SecureStore.getItemAsync("publicKey");
    const privKeyFromStore = await SecureStore.getItemAsync("privateKey");
    setIsFetchingKeys(false);

    if (pubKeyFromStore && privKeyFromStore) {
      return { pubKey: pubKeyFromStore, privKey: privKeyFromStore };
    } else {
      setIsGeneratingKeys(true);

      try {
        const keys = await generateKeysAsync();

        const rsaPubKey = forge.pki.publicKeyToPem(keys.publicKey);
        const rsaPrivKey = forge.pki.privateKeyToPem(keys.privateKey);

        return { pubKey: rsaPubKey, privKey: rsaPrivKey };
      } catch (error) {
        console.error("Error during key generation:", error);
        throw error;
      } finally {
        setIsGeneratingKeys(false);
      }
    }
  };

  return { isFetchingKeys, isGeneratingKeys, getOrGenerateKeys };
};
