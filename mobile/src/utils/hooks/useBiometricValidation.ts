// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useState, useEffect } from "react";
import { biometricValidation } from "../biometric";

export const useBiometricValidation = () => {
  const [isBiometricCheckPassed, setIsBiometricCheckPassed] = useState<
    boolean | undefined
  >();
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryBiometric, setRetryBiometric] = useState(false);

  useEffect(() => {
    async function checkBiometric() {
      setIsBiometricCheckPassed(undefined);
      setIsLoading(true);
      try {
        const biometricCheck = await biometricValidation();

        if (biometricCheck.result === "success") {
          setIsBiometricCheckPassed(true);
        } else {
          setIsBiometricCheckPassed(false);
        }
      } catch (e) {
        setError({ message: "Error checking biometric" });
      } finally {
        setIsLoading(false);
      }
    }

    checkBiometric();
  }, [retryBiometric]);

  function triggerRetry() {
    setRetryBiometric(!retryBiometric);
  }

  return { isBiometricCheckPassed, triggerRetry, error, isLoading };
};
